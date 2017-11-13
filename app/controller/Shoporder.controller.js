sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/routing/History',
    'sap/m/Dialog',
    'sap/ui/core/Fragment',
], function (jQuery, MessageToast, Controller, JSONModel, History, Dialog, Fragment) {
    "use strict";
    var ShoporderController = Controller.extend("myapp.controller.Shoporder", {
        _oDialog: null,
        shopOrderModel: null,
        shoporderid: null,
        plantid: null,
        onInit: function () {

            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            if (typeof sap.ui.getCore().getModel().getData().workcenter != null) {
                this.getView().setModel(this.initShoporder());
                this.shopOrderModel = this.getView().getModel();
            } else {
                alert("error");
            }
        },

        initShoporder: function () {
            var oModel = new JSONModel();

            var transactionName = "XAC_GetAllShopOrderForAWorkcenterByUser";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + sap.ui.getCore().getModel().getData().workcenter.plant + "&workcenterid=" + sap.ui.getCore().getModel().getData().workcenter.id + "&user=" + sap.ui.getCore().getModel().getData().workcenter.user;
            var transactionCall = site + "/XACQuery" + "/" + transactionName;

            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: true,
                success: function (oData) {
                    oModel.setData(oData.Rowsets.Rowset[0].Row);
                },
                error: function (oData) {
                    that.error(oData);
                }
            });

            return oModel;
        },
        handleRouteMatched: function (oEvent) {
            if (!this._checkRoute(oEvent, "shoporder")) {
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
            if (typeof sap.ui.getCore().getModel().getData().workcenter != null) {
                this.getView().setModel(this.initShoporder());
                this.shopOrderModel = this.getView().getModel();

            } else {
                alert("error");
            }
        },
        onAfterRendering: function () {

        },
        onNavBack: function () {
            var newModel = new JSONModel();
            this.getView().setModel(newModel);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("machine", true);

        },
        onToTmpPage: function (event) {

            this.getOwnerComponent().getRouter().navTo("tmp");

        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        },

        apriDialog: function (oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("myapp.view.ComponentDialog", this);
            }
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);


            //this.getView().setModel(this.getPhase(oEvent), 'phase');
            this._oDialog.setModel(this.getPhase(oEvent));
            this._oDialog.open();
        },
        getPhase: function (oEvent) {
            var oModel = new JSONModel();

            var str = oEvent.mParameters.id;
            if (str.length > 0) {
                var veryl = str.length;
                var cont = "container-";
                var num = str.search("container-");
                var len = cont.length;
                var res = str.substring(len + num, veryl);

                var transactionName = "XAC_GetAllShopOrderPhase";
                var that = this;
                var site = "iGuzzini";
                var input = "&plant=" + this.getView().getModel().getData()[res].PlantID + "&shoporderid=" + this.getView().getModel().getData()[res].ID;
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
                /*sap.ui.getCore().getModel().setProperty("/phase", {
                 "stepid": this.getView().getModel().getData()[0].stepid,
                 "plant": this.plant
                 }); */

                return oModel;
            }
        },
        goToPod: function (oEvent) {
            alert("siii");
            var a = oEvent;
        }
    });

    return ShoporderController;

});