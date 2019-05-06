sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/Controller',
    'myapp/controller/Library'

], function (jQuery, MessageToast, MessageBox, JSONModel, Controller, Library) {
    "use strict";

    var WorkinstructionsController = Controller.extend("myapp.controller.Workinstructions", {
        workcenterid: null,
        shoporderid: null,
        plantid: null,
        user: null,
        _oDialog: null,

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
            var transactionName = "GetAllWorkInstructionsFromShopOrderID";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid + "&workcenterid="+this.workcenterid;
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
        toPdfView: function (name, istext, pdfUrl, value) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("myapp.view.Winstruction", this);
            }
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
            var obj = {"workinstruction": name, "IsText": istext, "url": pdfUrl, "value": value};
            var model = new JSONModel();
            model.setData(obj);
            this._oDialog.setModel(model);
            this._oDialog.open();

        },
        openPdf: function (event) {
            Library.updateLastActionDate(this.user, this.plant);

            var ctx = event.getSource().getParent().getBindingContext();
            var model = ctx.getModel();
            var path = ctx.getPath();
            var obj = model.getProperty(path);
            var pdfUrl = obj.url;
            this.toPdfView(obj.workinstruction, obj.isText, pdfUrl, obj.value);
        },
        onExitWI: function () {
            Library.updateLastActionDate(this.user, this.plant);

            if (this._oDialog) {
                this._oDialog.close();
            }
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
