sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/routing/History',
    'sap/ui/core/mvc/Controller'
], function (jQuery, JSONModel, MessageToast, MessageBox, History, Controller) {
    "use strict";
    var MainPodController = Controller.extend("myapp.controller.MainPod", {
        workcenterid: null,
        shoporderid: null,
        plantid: null,
        user: null,
        stepid: null,
        shoporder: null,
        sfc: null,
        test: null,
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.initPod();
        },
        initPod: function () {
            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenter = sap.ui.getCore().getModel().getData().informations.workcenter;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
            this.stepid = sap.ui.getCore().getModel().getData().informations.stepid;
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;
            this.sfc = sap.ui.getCore().getModel().getData().informations.sfc;
            this.test = new JSONModel();
            this.test.setData(sap.ui.getCore().getModel().getData().informations);
            this.getView().setModel(this.test);
        },
        navToBackPage: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("shoporder", true);
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
                this.initPod();
            } else {
                alert("error");
            }
        },
        startOperations: function (event) {
            var opselected = sap.ui.getCore().getModel().getData().operationselected;
            if (typeof opselected === "undefined") {
                MessageToast.show("Select an operation first!");
            } else {
                if (opselected.status === "In queue") {
                    this.performStart(opselected);
                } else {
                    MessageToast.show("Select an operation in queue!");
                }
            }
        },
        performStart: function (rowSelected) {
            var transactionName = "StartOperation";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&operationid=" + rowSelected.operation_id + "&shoporderid=" + this.shoporderid + "&sfc=" + this.sfc + "&user=" + this.user + "&workcenterid=" + this.workcenterid + "&resourceid=";
            var transactionCall = site + "/Transaction" + "/" + transactionName;
            jQuery.ajax({
                url: "/XMII/Runner?Transaction=" + transactionCall + input + "&OutputParameter=JSON&Content-Type=text/xml",
                method: "GET",
                async: false,
                success: function (oData) {
                    var result = JSON.parse(oData.documentElement.textContent);
                    if (result.error == "0" || result.error == 0) {
                        var oEventBus = sap.ui.getCore().getEventBus();
                        oEventBus.publish("MainPod", "updateOperation");

                    } else {
                        MessageToast.show("Errore! " + result.errorMessage);
                    }
                },
                error: function (oData) {
                    alert("errore");
                }
            });
        }

    });
    return MainPodController;
});
