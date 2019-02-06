sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'myapp/controller/Library'
], function(jQuery, MessageToast, Controller, JSONModel, Library) {
    "use strict";

    var MachineController = Controller.extend("myapp.controller.Machine", {
        mainModel: null,
        myModel: new JSONModel({}),
        user: null,
        plant: null,
        onInit: function() {


            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);

            var params = jQuery.sap.getUriParameters(window.location.href);
            console.log(params);
            this.user = "mbaratella";
            this.plant = 1;


        },
        handleRouteMatched: function(oEvent) {
            if (!this._checkRoute(oEvent, "machine")) {
                return;
            }
            
            this.update();
        },
        _checkRoute: function(evt, pattern) {
            if (evt.getParameter("name") !== pattern) {
                return false;
            }

            return true;
        },
        update: function() {
            this.initTiles();
        },
        initTiles: function() {

            var transactionName = "XAC_GetAllWorkcenterByTypeAndUsername";
            var site = "iGuzzini";
            var input = "&plant=1&type=M&user=mbaratella";
            var transactionCall = site + "/XACQuery" + "/" + transactionName;
            var link = "XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json";
            
            Library.AjaxCallerData(link, this.SUCCESSInitTiles.bind(this), this.FAILUREInitTiles.bind(this));
        },
        SUCCESSInitTiles: function(Jdata) {
            this.myModel.setData(Jdata.Rowsets.Rowset[0].Row);
            this.getView().setModel(this.myModel);
        },
        FAILUREInitTiles: function() {
            alert("error");
        },
        navToShoporder: function(event) {
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
                oRouter.navTo("shoporder", true);
            } else
                alert("errore");
        }
    });

    return MachineController;

});