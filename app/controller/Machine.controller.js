sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'

], function (jQuery, MessageToast, Controller, JSONModel) {
    "use strict";

    var MachineController = Controller.extend("myapp.controller.Machine", {

        onInit: function () {

            var params = jQuery.sap.getUriParameters(window.location.href);
            console.log(params);
            var oModel = this.initTiles();
            this.getView().setModel(oModel);

        },
        initTiles: function () {
            var oModel = new JSONModel();
            jQuery.ajax(jQuery.sap.getModulePath("myapp", "./model/tiles.json"), {
                dataType: "json",
                success: function (oData) {

                    oModel.setData(oData);
                }.bind(this),
                error: function () {
                    jQuery.sap.log.error("failed to load json");
                }
            });

            return oModel;
        },
        onAfterRendering: function () {


        },

        onToTmpPage: function (event) {

            this.getOwnerComponent().getRouter().navTo("tmp");

        },
        ciao: function () {
            var transactionName = "GetAllWorkcenterByTypeAndUsername";

            var that = this;

            var transactionCall ="iGuzzini/" + "Transaction" + "/" + transactionName;



            var params = {
                "Transaction": transactionCall,
                "plant":"1",
                "type":"A",
                "user":"mbaratella",
                "OutputParameter": "output"
            };

            try {
                var req = jQuery.ajax({
                    url: "/XMII/Runner?Transaction=iGuzzini/Transaction/GetAllWorkcenterByTypeAndUsername&Content-Type=text/xml",
                    method: "GET",
                    dataType: "xml",
                    async: true
                });
                req.done(jQuery.proxy(that.done, that));
                req.fail(jQuery.proxy(that.error, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        }

    });

    return MachineController;

});