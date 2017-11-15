sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/Control'
], function (jQuery, Control) {
    "use strict";

    var IFrameComponent = Control.extend("podlamb.component.IFrame", {
        metadata: {
            properties: {
                "id": {type: "string"},
                "src": {type: "string"},
                "height": {
                    type: "sap.ui.core.CSSSize"
                },
                "width": {
                    type: "sap.ui.core.CSSSize"
                },
                "visible": {type: "boolean", defaultValue: true}
            }
        },
        renderer: function (oRm, oControl) {

            if (oControl.getVisible() === true) {

                oRm.write("<iframe");
                oRm.writeControlData(oControl);
                oRm.write("src=" + "'" + oControl.getSrc() + "'");
                if (oControl.getWidth() && null !== oControl.getWidth()) {
                    oRm.addStyle("width", oControl.getWidth());
                }
                if (oControl.getHeight() && null !== oControl.getHeight()) {
                    oRm.addStyle("height", oControl.getHeight());
                }
                oRm.writeStyles();
                oRm.addClass("customIFrameComp");
                oRm.writeClasses();
                oRm.write("/>");
            }

        },
        onAfterRendering: function () {

        }
    });

    return IFrameComponent;
});
