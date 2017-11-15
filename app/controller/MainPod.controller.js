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
        test:null,
        
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
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporder;
            
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
        startOperations: function (oEv) {
            alert("oev");
        }

    });

    return MainPodController;

});
