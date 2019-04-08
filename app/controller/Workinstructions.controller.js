sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel',

    'sap/ui/core/mvc/Controller'
], function (jQuery, MessageToast, MessageBox, JSONModel, Controller) {
    "use strict";

    var WorkinstructionsController = Controller.extend("myapp.controller.Workinstructions", {
        workcenterid: null,
        shoporderid: null,
        plantid: null,
        user: null,
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.getView().setModel(this.initWI()); 
        },
        onAfterRendering: function () {


        },
        initWI: function () {
            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;

            var oModel = new JSONModel();
            /*          var transactionName = "XAC_GetAllDataCollections";
             var that = this;
             var site = "iGuzzini";
             var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid + "&stepid=" + this.stepid;
             var transactionCall = site + "/XACQuery" + "/" + transactionName;
             
             jQuery.ajax({
             url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
             method: "GET",
             async: false,
             success: function (oData) {
             oModel.setData(oData.Rowsets.Rowset[0].Row);
             },
             error: function (oData) {
             that.error(oData);
             }
             });
             */
            var transactionName = "GetAllWorkInstructionsFromShopOrderID";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid;
            var transactionCall = site + "/Transaction" + "/" + transactionName;

            jQuery.ajax({
                url: "/XMII/Runner?Transaction=" + transactionCall + input + "&OutputParameter=JSON&Content-Type=text/xml",
                method: "GET",
                async: false,
                success: function (oData) {
                    oModel.setData(JSON.parse(oData.documentElement.textContent));
                },
                error: function (oData) {
                    alert("errore");
                }
            });
            return oModel;
        },
        handleRouteMatched: function (oEvent) {
            if (!this._checkRoute(oEvent, "mainpod")) {
                return;
            }

            this.update();
        },
        _checkRoute: function (evt, pattern) {
            if (evt.getParameter("name") !== pattern) {
                return false;
            }

            return true;
        },
        update: function () {
            if (typeof sap.ui.getCore().getModel().getData().informations != null) {
                this.getView().setModel(this.initWI());


            } else {
                alert("error");
            }
        },

    });

    return WorkinstructionsController;

});
