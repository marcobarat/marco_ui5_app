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
        resourceid: null,
        resource: null,
        plantid: null,
        user: null,
        stepid: null,
        shoporder: null,
        sfc: null,
        test: null,
        _oDialog: null,

        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.initPod();
        },
        initPod: function () {
            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenter = sap.ui.getCore().getModel().getData().informations.workcenter;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.resourceid = sap.ui.getCore().getModel().getData().informations.resourceid;
            this.resource = sap.ui.getCore().getModel().getData().informations.resource;
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
        startOperation: function (event) {
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
            var input = "&plant=" + this.plantid + "&operationid=" + rowSelected.operation_id + "&sfcstepid=" + rowSelected.sfcstepid + "&stepid=" + this.stepid + "&shoporderid=" + this.shoporderid + "&sfc=" + this.sfc + "&user=" + this.user + "&workcenterid=" + this.workcenterid + "&resourceid=" + this.resourceid;
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
                        oEventBus.publish("MainPod", "updateRowSel");


                    } else {
                        MessageToast.show("Error! " + result.errorMessage);
                    }
                },
                error: function (oData) {
                    alert("errore");
                }
            });
        },
        stopOperation: function (event) {
            var opselected = sap.ui.getCore().getModel().getData().operationselected;
            if (typeof opselected === "undefined") {
                MessageToast.show("Select an operation first!");
            } else {
                //if (opselected.status === "In work") { 
                /*
                 * Bug nell'aggiornamento dell'operazione selezionata: dopo aver fatto lo start
                 * l'operazione selezionata ha ancora status in queue e non in work!
                 */
                this.performStop(opselected);
            }
        },
        performStop: function (rowSelected) {
            var transactionName = "CompleteOperation";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&operationid=" + rowSelected.operation_id + "&stepid=" + this.stepid + "&shoporderid=" + this.shoporderid + "&sfc=" + this.sfc + "&user=" + this.user + "&workcenterid=" + this.workcenterid + "&resourceid=" + this.resourceid;
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
                        //oEventBus.publish("MainPod", "updateRowSel");


                    } else {
                        MessageToast.show("Error! " + result.errorMessage);
                    }
                },
                error: function (oData) {
                    alert("errore");
                }
            });
        },
        onExit: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        },
        loggedDC: function (oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("myapp.view.LoggedDC", this);
            }
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);


            //this.getView().setModel(this.getPhase(oEvent), 'phase');
            this._oDialog.setModel(this.getLoggedDC(oEvent));
            this._oDialog.open();
        },

        getLoggedDC: function (oEvent) {
            var oModel = new JSONModel();



            var transactionName = "XAC_GetLoggedDC";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&sfc=" + this.sfc;
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

            return oModel;

        }

    });
    return MainPodController;
});
