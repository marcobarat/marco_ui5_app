sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/Controller'
], function (jQuery, MessageToast, MessageBox, JSONModel, Controller) {
    "use strict";

    var DataCollectionController = Controller.extend("myapp.controller.DataCollection", {
        workcenterid: null,
        shoporderid: null,
        plantid: null,
        user: null,
        stepid: null,
        dcMain: "",
        dcPar: "",

        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.getView().setModel(this.initDC());

            var that = this;

            jQuery.ajax({
                dataType: "text",
                url: "model/dcMain.xml",
                success: function (data) {
                    that.dcMain = data;
                },
                async: false
            });
            jQuery.ajax({
                dataType: "text",
                url: "model/dcPar.xml",
                success: function (data) {
                    that.dcPar = data;
                },
                async: false
            });

        },
        onAfterRendering: function () {



        },
        initDC: function () {
            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
            this.stepid = sap.ui.getCore().getModel().getData().informations.stepid;
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;

            var oModel = new JSONModel();
            /*          var transactionName = "XAC_GetAllDataCollections";
             var that = this;
             var site = "iGuzzini";
             var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid + "&stepid=" + this.stepid;
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
             */
            var transactionName = "GetAllDataCollections";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid + "&stepid=" + this.stepid;
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
        saveDc: function (oEv) {
            var a = 12;
            var dcGroups = this.getView().getModel().getData();
            var parXml = "", dc;
            for (var idc in dcGroups) {
                dc = dcGroups[idc];
                parXml = parXml + this.dcMain.replace("${dcGroupId}", dc.dcgroupid).replace("${operationId}", dc.operationid)
                        .replace("${user}", sap.ui.getCore().getModel().getData().informations.user)
                        .replace("${sfc}", sap.ui.getCore().getModel().getData().informations.sfc).replace("${workCenterId}", sap.ui.getCore().getModel().getData().informations.workcenterid);
                var valueList = "", par, parameters = dc.dcparameterlist;
                for (var index in parameters) {
                    par = parameters[index];
                    valueList = valueList + this.dcPar.replace("${dcparameterid}", par.dcparameterid)
                            .replace("${dcvalue}", par.value)
                            .replace("${dcmaxvalue}", par.max_value)
                            .replace("${dcminvalue}", par.min_value)
                            .replace("${dccheckvalue}", '0')
                            .replace("${dcisinteger}", par.isinteger)
                            .replace("${dcComment}", par.comments.replace(/("|&|\n|\r|\\)/g, ' '));
                }

                parXml = parXml.replace("${valueList}", valueList);
            }
            var save = "<dcGroups>" + parXml + "</dcGroups>";
            console.log(save);


        },
        update: function () {
            if (typeof sap.ui.getCore().getModel().getData().informations != null) {
                this.getView().setModel(this.initDC());


            } else {
                alert("error");
            }
        },
        handleLiveChange: function (event) {
            var newValue = event.getParameter("value");
            var src = event.getSource();
            src.setValue(newValue);
            jQuery.sap.log.debug(">>>" + newValue);
        }
    });

    return DataCollectionController;

});
