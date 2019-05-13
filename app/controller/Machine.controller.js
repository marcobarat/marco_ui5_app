sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'myapp/controller/Library'
], function (jQuery, MessageToast, Controller, JSONModel, Library) {
    "use strict";

    var MachineController = Controller.extend("myapp.controller.Machine", {
        mainModel: null,
        myModel: new JSONModel({}),
        user: null,
        plant: 1,
        repartoid: null,
        AREA: null,
        modelArea: new JSONModel({}),

        onInit: function () {
            this.user = jQuery.sap.getUriParameters().get("CID");
            this.repartoid = jQuery.sap.getUriParameters().get("repartoid");

            if (this.user == null || typeof this.user == "undefined") {
                MessageToast.show("Violate regole di sicurezza.");
                return;
            }
            if (this.repartoid == null || typeof this.repartoid == "undefined") {
                MessageToast.show("Violate regole di sicurezza.");
                return;
            }
            this.getView().setModel(this.modelArea, "modelArea");

            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);




        },
        handleRouteMatched: function (oEvent) {
            if (!this._checkRoute(oEvent, "machine")) {
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
            this.initTiles();
        },
        initTiles: function () {
            Library.updateLastActionDate(this.user, this.plant);

            //var transactionName = "XAC_GetAllWorkcenterByTypeAndUsername";
            var transactionName = "XAC_GetAllWorkcenterByTypeAndRepartoID";

            var site = "iGuzzini";
            var input = "&plant=" + this.plant + "&type=I&repartoid=" + this.repartoid;
            //var input = "&plant=1&type=A&user=" + this.user;
            var transactionCall = site + "/XACQuery" + "/" + transactionName;
            var link = "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json";

            //link = "model/machinesArea" + String(this.AREA) + ".json";

            Library.AjaxCallerData(link, this.SUCCESSInitTiles.bind(this), this.FAILUREInitTiles.bind(this));
        },
        SUCCESSInitTiles: function (Jdata) {
            this.myModel.setData(Jdata.Rowsets.Rowset[0].Row);
            this.getView().setModel(this.myModel);
        },
        FAILUREInitTiles: function () {
            alert("error");
        },
        navToShoporder: function (event) {
            this.myModel = new JSONModel();

            var str = event.mParameters.id;
            if (str.length > 0) {
                var veryl = str.length;
                var cont = "container-";
                var num = str.search("container-");
                var len = cont.length;
                var res = str.substring(len + num, veryl);

                this.myModel.setProperty("/workcenter", {
                    "workcenter": this.getView().getModel().getData()[res].workcenter,
                    "id": this.getView().getModel().getData()[res].id,
                    "typemachine": this.getView().getModel().getData()[res].typemachine,
                    "description": this.getView().getModel().getData()[res].description,
                    "user": this.user,
                    "plant": this.plant
                });
                sap.ui.getCore().setModel(this.myModel);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                Library.updateLastActionDate(this.user, this.plant);
                oRouter.navTo("shoporder", true);
            } else
                alert("errore");
        },
        navToMain: function () {
            window.location.href = "../main/index.html";
        }
    });

    return MachineController;

});