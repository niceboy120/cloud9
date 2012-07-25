/**
 * Code Editor for the Cloud9 IDE
 *
 * @copyright 2010, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
 
define(function(require, exports, module) {

window.adbg = {
    exec : function(method, args, callback, options) {
        if (method == "loadScript") {
            var dbg = args[0].main;
            var script = args[1];
            dbg.loadScript(script, function(source) {
                if (options && options.callback) {
                    options.callback(apf.escapeXML(source), apf.SUCCESS);
                } else {
                    // callback("<file>" + apf.escapeXML(source) + "</file>", apf.SUCCESS);
                    // TODO: ugly text() bug workaround
                    callback("<file><![CDATA[" + source.replace("]]>", "]] >") + "]]></file>", apf.SUCCESS);
                }
            });
        }
        else if (method == "loadObjects") {
            var dbg = args[0].main;
            var item = args[1];

            dbg.loadObjects(item, function(xml) {
                if (options && options.callback) {
                    options.callback(xml, apf.SUCCESS);
                } else {
                    callback(xml, apf.SUCCESS);
                }
            });
        }
        else if (method == "loadFrame") {
            var dbg = args[0].main;
            var frame = args[1];

            dbg.loadFrame(frame, function(xml) {
                if (options && options.callback) {
                    options.callback(xml, apf.SUCCESS);
                } else {
                    callback(xml, apf.SUCCESS);
                }
            });
        }
    }
};

(apf.$asyncObjects || (apf.$asyncObjects = {}))["adbg"] = 1;


module.exports = {
    // registers global objects needed for apf ui elements
    registerDebugger: function(_debugger) {
        if (window.dbg)
            return;
        new apf.state({
            "id" : "dbg"
        });
        
        dbg.main = _debugger;
        dbg.breakpoints = _debugger.breakpoints;
        dbg.sources = _debugger.sources;
        
        // apf doesn't like if this is called too fast
        var timeout, state = false;
        ide.addEventListener("dbg.changeState", function(e) {
            state = e.state;
            clearTimeout(timeout);
            var timeout = setTimeout(function(){
                apf.xmldb.setAttribute(dbg, "state", state || false);
            }, 80)
        });
        
        ide.addEventListener("dbg.changeFrame", function(e) {
            apf.xmldb.setAttribute(dbg, "state", e.activeFrame || false);
        });
    }
}

});

