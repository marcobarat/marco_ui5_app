sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller'
], function (jQuery, JSONModel, MessageToast, MessageBox, Controller) {
    "use strict";

    var OperationsController = Controller.extend("myapp.controller.Operations", {
        workcenterid: null,
        shoporderid: null,
        plantid: null,
        user: null,
        stepid: null,

        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.getView().setModel(this.initOperations());
        },
        onAfterRendering: function () {



        },
        initOperations: function () {
            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
            this.stepid = sap.ui.getCore().getModel().getData().informations.stepid;
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;
            var oModel = new JSONModel();
            var transactionName = "XAC_GetAllPhaseOperation";
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
            sap.ui.getCore().getModel().setProperty("/operations", 
                oModel.getData());
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
                this.getView().setModel(this.initOperations());


            } else {
                alert("error");
            }
        },
    });

    return OperationsController;

});
