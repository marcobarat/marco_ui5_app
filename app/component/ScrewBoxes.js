sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/Control'
], function (jQuery, Control) {
    "use strict";

    var ScrewBoxes = Control.extend("podlamb.component.ScrewBoxes", {
        __mariage: false,
        metadata: {
            properties: {
                "id": {type: "string"},
                "conf": {type: "object"},
                "type": {type: "string"},
                "rowMax": {type: "int", defaultValue: 6},
                "visible": {type: "boolean", defaultValue: true}
            }
        },
        renderer: function (oRm, oControl) {

            var conf = oControl.getConf();

            var autoTotScrews = -1;
            var autoOkScrews = -1;
            var autoLastScrew = "";

            var autoKoScrews = -1; //used in mariage logic

            var gTYPE = "";

            if ("A" === conf.type) {
                gTYPE = "A";
            }
            if ("E" === conf.type) {
                gTYPE = "E";
                oControl.__mariage = true;
            }
            if ("R" === conf.type) {
                gTYPE = "R";
                oControl.__mariage = true;
            }

            try {
                if (conf.auto_tot_screws && "" !== conf.auto_tot_screws) {
                    autoTotScrews = Number(conf.auto_tot_screws);
                }
                if (conf.auto_ok_screws && "" !== conf.auto_ok_screws) {
                    autoOkScrews = Number(conf.auto_ok_screws);
                }
                autoLastScrew = conf.auto_last_screw;
            } catch (err) {
                jQuery.sap.log.error(err);
            }
            try {
                if (conf.auto_ko_screws && "" !== conf.auto_ko_screws) {
                    autoKoScrews = Number(conf.auto_ko_screws);
                }
            } catch (err) {
                jQuery.sap.log.error(err);
            }


            if (oControl.getVisible() === true) {

                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.writeStyles();
                oRm.addClass("screwBoxContainer");
                oRm.writeClasses();
                oRm.write(">");

                if (autoTotScrews !== -1) {

                    //oControl.openScrewRow(oRm);

                    if ("A" === gTYPE) {

                        for (var idx = 0; idx < autoTotScrews; idx++) {

                            if (idx % oControl.getRowMax() === 0) {
                                oControl.openScrewRow(oRm);
                            }

                            if (idx < autoOkScrews) {
                                oRm.write("<div");
                                oRm.addClass("screwGreenBox");
                                oRm.writeClasses();
                                oRm.write("/>");
                            } else if (idx === autoOkScrews && "KO" === autoLastScrew) {
                                oRm.write("<div");
                                oRm.addClass("screwRedBox");
                                oRm.writeClasses();
                                oRm.write("/>");
                            } else {
                                oRm.write("<div");
                                oRm.addClass("screwGreyBox");
                                oRm.writeClasses();
                                oRm.write("/>");
                            }

                            if (idx % oControl.getRowMax() === oControl.getRowMax() - 1) {
                                oControl.closeScrewRow(oRm);
                            }
                        }

                    }

                    if ("E" === gTYPE) {
                        oControl.openScrewRow(oRm);

                        oRm.write("<div");
                        oRm.addClass("screwMAGreyBox");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<span");
                        oRm.addClass("screwMABoxContent");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write(autoTotScrews - autoOkScrews - autoKoScrews);
                        oRm.write("</span>");
                        oRm.write("</div>");

                        oRm.write("<div");
                        oRm.addClass("screwMAGreenBox");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<span");
                        oRm.addClass("screwMABoxContent");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write(autoOkScrews);
                        oRm.write("</span>");
                        oRm.write("</div>");

                        oRm.write("<div");
                        oRm.addClass("screwMARedBox");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<span");
                        oRm.addClass("screwMABoxContent");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write(autoKoScrews);
                        oRm.write("</span>");
                        oRm.write("</div>");

                        oControl.closeScrewRow(oRm);
                    }

                    if ("R" === gTYPE) {
                        
                        oControl.openScrewRow(oRm);

                        oRm.write("<div");
                        oRm.addClass("screwMAGreyBox");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<span");
                        oRm.addClass("screwMABoxContent");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write(autoTotScrews - autoOkScrews - autoKoScrews);
                        oRm.write("</span>");
                        oRm.write("</div>");

                        oRm.write("<div");
                        oRm.addClass("screwMAGreenBox");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<span");
                        oRm.addClass("screwMABoxContent");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write(autoOkScrews);
                        oRm.write("</span>");
                        oRm.write("</div>");

                        oRm.write("<div");
                        oRm.addClass("screwMARedBox");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<span");
                        oRm.addClass("screwMABoxContent");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write(autoKoScrews);
                        oRm.write("</span>");
                        oRm.write("</div>");

                        oControl.closeScrewRow(oRm);

                    }

                }

                oRm.write("</div>");
            }

        },
        openScrewRow: function (oRm) {
            oRm.write("<div");
            oRm.writeStyles();
            oRm.addClass("screwBoxes");
            oRm.writeClasses();
            oRm.write(">");
        },
        closeScrewRow: function (oRm) {
            oRm.write("</div>");
        },
        onAfterRendering: function () {

            try {
                if (true === this.__mariage) {
                    var currentElem = jQuery.sap.byId(this.getId()).get(0);
                    jQuery(currentElem).closest("table[id$='tab1-listUl']").find("th[id$='tab1-tblHead4']").width("45%");
                }
            } catch (err) {
                jQuery.sap.log.error(err);
            }

        }
    });

    return ScrewBoxes;
});
