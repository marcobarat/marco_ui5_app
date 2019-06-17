sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/Controller',
    'myapp/controller/Library'

], function (jQuery, MessageToast, MessageBox, JSONModel, Controller, Library) {
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
            var transactionName = "GetAllDataCollectionsFromShopOrderID";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&shoporderid=" + this.shoporderid + "&workcenterid=" + this.workcenterid;
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
            Library.updateLastActionDate(this.user, this.plant);

            var str = oEv.oSource.sId;
            var veryl = str.length;
            var cont = "__list0-";
            var num = str.search("__list0-");
            var len = cont.length;
            var res = str.substring(len + num, veryl);
            var dcGroups = this.getView().getModel().getData();
            var parXml = "",
                dc;
            var operationid;
            var resourceid;
            var sfc = sap.ui.getCore().getModel().getData().informations.sfc;
            var ciclo = 1;
            var send = 1;
            while (ciclo != 0) {
                try {
                    dc = dcGroups[res];
                    operationid = dc.operationid;
                    parXml = parXml + this.dcMain.replace("${dcGroupId}", dc.dcgroupid).replace("${operationId}", dc.operationid)
                        .replace("${user}", sap.ui.getCore().getModel().getData().informations.user)
                        .replace("${sfc}", sap.ui.getCore().getModel().getData().informations.sfc).replace("${workCenterId}", sap.ui.getCore().getModel().getData().informations.workcenterid);
                    var valueList = "",
                        par, parameters = dc.dcparameterlist;
                    for (var index in parameters) {
                        par = parameters[index];
                        var comment = "";
                        if (typeof (par.dccomment) != "undefined")
                            comment = par.dccomment;
                        else
                            comment = "";
                        if (typeof (par.value) != "undefined") {
                            valueList = valueList + this.dcPar.replace("${dcparameterid}", par.dcparameterid)
                                .replace("${dcvalue}", par.value)
                                .replace("${dcmaxvalue}", par.max_value)
                                .replace("${dcminvalue}", par.min_value)
                                .replace("${dccheckvalue}", '0')
                                .replace("${dcComment}", comment)
                                .replace("${dcisinteger}", par.isinteger);
                        } else {
                            MessageToast.show("Inser a value!");
                            send = 0;
                            break;
                        }

                        //.replace("${dcComment}", par.comments.replace(/("|&|\n|\r|\\)/g, ' '));
                    }

                    parXml = parXml.replace("${valueList}", valueList);
                } catch (err) {
                    MessageToast.show("Error!");
                }


                ciclo--;
            }
            var logdc = "<dcGroups>" + parXml + "</dcGroups>";



            var transactionName = "LogDC";
            var that = this;
            var site = "iGuzzini";
            var transactionCall = site + "/Transaction" + "/" + transactionName;


            var params = {
                "TRANSACTION": transactionCall,
                "plant": this.plantid,
                "shoporderid": this.shoporderid,
                "operationid": operationid,
                "resourceid": resourceid,
                "sfc": sfc,
                "workcenterid": this.workcenterid,
                "stepid": this.stepid,
                "user": this.user,
                "dclist": logdc,
                "OutputParameter": "JSON"
            };

            if (send == 1) {
                jQuery.ajax({
                    url: "/XMII/Runner",
                    data: params,
                    method: "POST",
                    dataType: "xml",
                    async: true,
                    success: function (oData) {
                        var result = JSON.parse(oData.documentElement.textContent);
                        if (result.error == "0" || result.error == 0) {
                            MessageToast.show("Saved!");
                            that.onInit();
                        } else {
                            MessageToast.show("Error! " + result.errorMessage);
                        }
                    },
                    error: function (oData) {
                        MessageToast.show("Error while saving!");

                    }
                });
            }

            console.log(logdc);


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