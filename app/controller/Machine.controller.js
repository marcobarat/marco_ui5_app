sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'myapp/utils/ModelManager'
], function(jQuery, MessageToast, Controller, JSONModel, ModelManager) {
    "use strict";

    var MachineController = Controller.extend("myapp.controller.Machine", {
        mainModel: null,
        myModel: null,
        user: null,
        plant: null,
        onInit: function() {


            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);

            var params = jQuery.sap.getUriParameters(window.location.href);
            console.log(params);
            this.myModel = this.initTiles();
            this.getView().setModel(this.myModel);
            //this.mainModel.setProperty("/user", {"user": "", "id": ""});
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
            this.myModel = this.initTiles();
            this.getView().setModel(this.myModel);
        },
        initTiles: function() {
            var oModel = new JSONModel();


            var transactionName = "XAC_GetAllWorkcenterByTypeAndUsername";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=1&type=M&user=mbaratella";
            var transactionCall = site + "/XACQuery" + "/" + transactionName;
            /*var params = {
                "QueryTemplate": transactionCall,
                "plant":"1",
                "type":"A",
                "user":"mbaratella",
            };
            
            try {
                var req = jQuery.ajax({
                    url: "/XMII/Illuminator?QueryTemplate="+transactionCall+input+"&Content-Type=text/json",
                    method: "GET",
                    async: true
                });
                req.fail(jQuery.proxy(that.error, that));
                req.done(jQuery.proxy(that.done, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            } */


            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: true,
                success: function(oData) {

                    oModel.setData(oData.Rowsets.Rowset[0].Row);
                    var a;
                }.bind(),
                error: function(oData) {
                    that.error(oData);
                }
            });

            return oModel;
        },
        onAfterRendering: function() {


        },

        onToTmpPage: function(event) {

            this.getOwnerComponent().getRouter().navTo("tmp");

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
                    "description": this.getView().getModel().getData()[res].description,
                    "user": this.user,
                    "plant": this.plant
                });
                sap.ui.getCore().setModel(this.myModel);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("shoporder", true);
            } else
                alert("errore");
        },
        error: function(data) {

            alert("error" + data);
        },
        done: function(data) {
            var result = data.Rowsets.Rowset[0].Row;
            alert(data);
        }

    });

    return MachineController;

});