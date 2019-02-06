sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/routing/History',
    'sap/m/Dialog',
    'sap/ui/core/Fragment',
    'myapp/controller/Library'
], function (jQuery, MessageToast, Controller, JSONModel, History, Dialog, Fragment, Library) {
    "use strict";
    var ShoporderController = Controller.extend("myapp.controller.Shoporder", {
        _oDialog: null,
        shopOrderModel: new JSONModel({}),
        shopOrderMenuModel: new JSONModel({}),
        workcenterid: null,
        workcenter: null,
        shoporderid: null,
        sfc: null,
        shoporder: null,
        resource: null,
        resourceid: null,
        plantid: null,
        user: null,
        transportModel: null,
        shopOrderMenu: null,
        BusyDialog: new sap.m.BusyDialog(),
        button: null,

        onInit: function () {

            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            if (typeof sap.ui.getCore().getModel().getData().workcenter === null) {
                alert("error");
            }
        },

        initShoporder: function () {

            this.workcenter = sap.ui.getCore().getModel().getData().workcenter.workcenter;
            this.workcenterid = sap.ui.getCore().getModel().getData().workcenter.id;
            this.plantid = sap.ui.getCore().getModel().getData().workcenter.plant;
            this.user = sap.ui.getCore().getModel().getData().workcenter.user;
            var transactionName = "XAC_GetAllShopOrderForAWorkcenterByUser";
            var site = "iGuzzini";
            var input = "&plant=" + sap.ui.getCore().getModel().getData().workcenter.plant + "&workcenterid=" + sap.ui.getCore().getModel().getData().workcenter.id + "&user=" + sap.ui.getCore().getModel().getData().workcenter.user;
            var transactionCall = site + "/XACQuery" + "/" + transactionName;

            var link = "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json";

            Library.AjaxCallerData(link, this.SUCCESSInitShoporder.bind(this), this.FAILUREInitShoporder.bind(this));
        },
        SUCCESSInitShoporder: function (Jdata) {
            this.shopOrderModel.setData(Jdata.Rowsets.Rowset[0].Row);
            this.getView().setModel(this.shopOrderModel);
        },
        FAILUREInitShoporder: function () {
            alert("error");
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
            if (typeof sap.ui.getCore().getModel().getData().workcenter !== null) {
                this.initShoporder();
            } else {
                alert("error");
            }
        },
        onNavBack: function () {
            var newModel = new JSONModel();
            this.getView().setModel(newModel);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("machine", true);

        },
        onExit: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        },
        apriDialog: function (event) {
            this.button = event.getSource();

            var link = "model/menuShopOrders.json";
            Library.AjaxCallerData(link, this.SUCCESSApriDialog.bind(this), this.FAILUREApriDialog.bind(this));
        },
        SUCCESSApriDialog: function (Jdata) {
            if (!this.shopOrderMenu) {
                this.shopOrderMenu = sap.ui.xmlfragment("myapp/view/menuShopOrders", this);
                this.getView().addDependent(this.shopOrderMenu);
            }
            var eDock = sap.ui.core.Popup.Dock;
            this.shopOrderMenu.open(this._bKeyboard, this.button, eDock.BeginTop, eDock.BeginMiddle, this.button);

            var menu = sap.ui.getCore().byId("menuID");
            menu.destroyItems();
            menu = this.fillMenu(menu, Jdata);
        },
        FAILUREApriDialog: function () {
            alert("error");
        },
        fillMenu: function (menu, json) {
            for (var key in json) {
                var item = new sap.ui.unified.MenuItem({text: json[key].name, enabled: json[key].isActive});
                if (json[key].subMenu) {
                    var subMenu = new sap.ui.unified.Menu();
                    subMenu = this.fillMenu(subMenu, json[key].subMenu);
                    item.setSubmenu(subMenu);
                }
                menu.addItem(item);
            }
            return menu;
        },
        goToPod: function (event) {
            var selection = event.getParameter("item");
            if (!selection.getSubmenu()) {
                var father = null;
                if (selection.getParent().isSubMenu()) {
                    father = selection.getParent().getParent().getText();
                }
                if (father === "Lavora") {
                    var phase = selection.getText();
                    this.transportModel = new JSONModel();
                    sap.ui.getCore().getModel().setProperty("/informations", {
                        "workcenter": this.workcenter,
                        "workcenterid": this.workcenterid,
                        "user": this.user,
                        "shoporderid": this.shoporderid,
                        "plant": this.plantid,
                        "shoporder": this.shoporder,
                        "resourceid": this.resourceid,
                        "resource": this.resource,
                        "sfc": this.sfc,
                        "stepid": phase
                    });
                    //sap.ui.getCore().setModel(this.transportModel);

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("mainpod", true);
                }
            }
        }

//        apriDialog: function (oEvent) {
//            if (!this._oDialog) {
//                this._oDialog = sap.ui.xmlfragment("myapp.view.ComponentDialog", this);
//            }
//            // toggle compact style
//            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
//
//
//            //this.getView().setModel(this.getPhase(oEvent), 'phase');
//            this._oDialog.setModel(this.getPhase(oEvent));
//            this._oDialog.open();
//        },
//        getPhase: function (oEvent) {
//            var oModel = new JSONModel();
//
//            var str = oEvent.mParameters.id;
//            if (str.length > 0) {
//                var veryl = str.length;
//                var cont = "container-";
//                var num = str.search("container-");
//                var len = cont.length;
//                var res = str.substring(len + num, veryl);
//
//                var transactionName = "XAC_GetAllShopOrderPhase";
//                var that = this;
//                var site = "iGuzzini";
//                var input = "&plant=" + this.getView().getModel().getData()[res].PlantID + "&shoporderid=" + this.getView().getModel().getData()[res].ID;
//                var transactionCall = site + "/XACQuery" + "/" + transactionName;
//                this.shoporderid = this.getView().getModel().getData()[res].ID;
//                this.shoporder = this.getView().getModel().getData()[res].ShopOrder;
//                this.resourceid = this.getView().getModel().getData()[res].Resid;
//                this.resource = this.getView().getModel().getData()[res].Resource;
//                this.sfc = this.getView().getModel().getData()[res].Sfc;
//
//
//                jQuery.ajax({
//                    url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
//                    method: "GET",
//                    async: false,
//                    success: function (oData) {
//
//                        oModel.setData(oData.Rowsets.Rowset[0].Row);
//                    },
//                    error: function (oData) {
//                        that.error(oData);
//                    }
//                });
//                /*sap.ui.getCore().getModel().setProperty("/phase", {
//                 "stepid": this.getView().getModel().getData()[0].stepid,
//                 "plant": this.plant
//                 }); */
//
//                return oModel;
//            }
//        },
//        goToPod: function (oEvent) {
//            var phase = oEvent.oSource.mProperties.title;
//            this.transportModel = new JSONModel();
//            sap.ui.getCore().getModel().setProperty("/informations", {
//                "workcenter": this.workcenter,
//                "workcenterid": this.workcenterid,
//                "user": this.user,
//                "shoporderid": this.shoporderid,
//                "plant": this.plantid,
//                "shoporder": this.shoporder,
//                "resourceid": this.resourceid,
//                "resource": this.resource,
//                "sfc": this.sfc,
//                "stepid": phase
//            });
//            //sap.ui.getCore().setModel(this.transportModel);
//
//            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//            oRouter.navTo("mainpod", true);
//        }
    });

    return ShoporderController;

});