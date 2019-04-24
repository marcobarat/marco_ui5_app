sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller',
    'myapp/controller/Library'

], function (jQuery, JSONModel, MessageToast, MessageBox, Controller, Library) {
    "use strict";

    var OperationsController = Controller.extend("myapp.controller.Operations", {
        workcenterid: null,
        shoporderid: null,
        plantid: null,
        user: null,
        qty: null,
        qtydone: null,
        stepid: null,
        selectedOp: null,
        clickEvent: null,
        onInit: function () {

            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("MainPod", "updateOperation", this.initOperationsB, this);
            oEventBus.subscribe("MainPod", "updateRowSel", this.updateRowSel, this);

            this.initOperations();
        },
        onAfterRendering: function () {



        },
        initOperations: function () {


            if (sap.ui.getCore().getModel()) {
                this.user = sap.ui.getCore().getModel().getData().informations.user;
                this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
                this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
                this.stepid = sap.ui.getCore().getModel().getData().informations.stepid;
                this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;
                this.qty = sap.ui.getCore().getModel().getData().informations.qty;
                this.qtydone = sap.ui.getCore().getModel().getData().informations.qtydone;


            }
            var oModel = new JSONModel();
            var transactionName = "XAC_GetAllShopOrderOperations";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid;
            var transactionCall = site + "/XACQuery" + "/" + transactionName;
            sap.ui.core.BusyIndicator.show();
            /*jQuery.ajax({
             url: "model/op.json",
             method: "GET",
             async: true,
             success: function (oData) {
             oModel.setData(oData.Rowsets.Rowset[0].Row);
             that.getView().setModel(oModel);
             sap.ui.core.BusyIndicator.hide();
             
             },
             error: function (oData) {
             that.error(oData);
             }
             });*/
            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: true,
                success: function (oData) {
                    oModel.setData(oData.Rowsets.Rowset[0].Row);
                    that.getView().setModel(oModel);
                    sap.ui.core.BusyIndicator.hide();

                },
                error: function (oData) {
                    that.error(oData);
                }
            });
            sap.ui.getCore().getModel().setProperty("/operations",
                    oModel.getData());
            return oModel;
        },
        initOperationsB: function () {
            var oView = this.getView();
            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
            this.stepid = sap.ui.getCore().getModel().getData().informations.stepid;
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;
            this.qty = sap.ui.getCore().getModel().getData().informations.qty;
            this.qtydone = sap.ui.getCore().getModel().getData().informations.qtydone;

            var oModel = new JSONModel();
            var transactionName = "XAC_GetAllPhaseOperation";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid + "&stepid=" + this.stepid;
            var transactionCall = site + "/XACQuery" + "/" + transactionName;
            sap.ui.core.BusyIndicator.show();

            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: true,
                success: function (oData) {
                    oModel.setData(oData.Rowsets.Rowset[0].Row);
                    oView.setModel(oModel);
                    sap.ui.core.BusyIndicator.hide();

                },
                error: function (oData) {
                    //that.error(oData);
                }
            });
            sap.ui.getCore().getModel().setProperty("/operations",
                    oModel.getData());
            return oModel;
        },
        rowOpSelected: function (event) {
            Library.updateLastActionDate(this.user, this.plant);

            var obj = event.getSource();
            var empty = {d: false, w: false};


            var tmpSelectedOp = obj.getBindingContext().getObject();
            sap.ui.getCore().getModel().setProperty("/clickevent",
                    tmpSelectedOp);

            if (tmpSelectedOp === undefined) {
                tmpSelectedOp.isSelected = false;
            }
            tmpSelectedOp.isSelected = tmpSelectedOp.isSelected === true ? false : true;
            if (true === tmpSelectedOp.isSelected) {
                obj.addStyleClass("selectedRow");
                sap.ui.getCore().getModel().setProperty("/operationselected",
                        tmpSelectedOp);
                this.selectedOp = tmpSelectedOp;
            } else {
                obj.removeStyleClass("selectedRow");
                this.selectedOp = empty;
                sap.ui.getCore().getModel().setProperty("/operationselected",
                        null);
            }
            var operations = this.getView().getModel().getData();

            //var operations = this.operationsModel.getProperty("/operations");
            for (var oi = 0, coi; oi < operations.length; oi++) {
                coi = operations[oi];
                if (coi.id !== tmpSelectedOp.id) {
                    coi.isSelected = false;
                }
            }

            var tab1 = this.getView().byId("tab1");

            var items = tab1.getItems();

            for (var i = 0, cobj; i < items.length; i++) {
                cobj = items[i];
                if (cobj.getId() !== obj.getId()) {
                    cobj.removeStyleClass("selectedRow");
                }
            }

            this.getView().getModel().refresh(true);
        },
        updateRowSel: function () {
            var oView = this.getView();
            this.clickEvent = sap.ui.getCore().getModel().getData().clickevent;

        },
        getSelectedOp: function () {
            return this.selectedOp;
        },
        refreshSelection: function () {
            Library.updateLastActionDate(this.user, this.plant);

            var tab1 = this.getView().byId("tab1");
            var items = tab1.getItems();

            for (var i = 0, cobj, modelObj; i < items.length; i++) {
                cobj = items[i];
                modelObj = cobj.getBindingContext("ops").getObject();
                if (modelObj.isSelected === true) {
                    cobj.addStyleClass("selectedRow");
                    break;
                }
            }
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
