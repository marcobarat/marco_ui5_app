sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/routing/History',
    'sap/ui/core/mvc/Controller',
    'myapp/controller/Library'

], function (jQuery, JSONModel, MessageToast, MessageBox, History, Controller, Library) {
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
        qtydone: null,
        qty: null,
        sfc: null,
        enabled: null,
        test: null,
        _oDialog: null,
        _oDialogSil: null,
        _oDialogEdit: null,
        _oDialogDC: null,
        interval: null,
        buttonSource: null,
        backupState: null,
        _oDialogSetup: null,

        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.initPod();
        },
        initPod: function () {

            this.buttonsLogic(sap.ui.getCore().getModel().getData().informations.state);

            this.user = sap.ui.getCore().getModel().getData().informations.user;
            this.workcenter = sap.ui.getCore().getModel().getData().informations.workcenter;
            this.workcenterid = sap.ui.getCore().getModel().getData().informations.workcenterid;
            this.resourceid = sap.ui.getCore().getModel().getData().informations.resourceid;
            this.resource = sap.ui.getCore().getModel().getData().informations.resource;
            this.plantid = sap.ui.getCore().getModel().getData().informations.plant;
            this.stepid = sap.ui.getCore().getModel().getData().informations.stepid;
            this.shoporderid = sap.ui.getCore().getModel().getData().informations.shoporderid;
            this.qty = sap.ui.getCore().getModel().getData().informations.qty;
            this.qtydone = sap.ui.getCore().getModel().getData().informations.qtydone;
            this.enabled = sap.ui.getCore().getModel().getData().informations.enabled;

            this.sfc = sap.ui.getCore().getModel().getData().informations.sfc;
            this.test = new JSONModel();
            this.test.setData(sap.ui.getCore().getModel().getData().informations);
            this.getView().setModel(this.test);
            Library.updateLastActionDate(this.user, this.plantid);

        },

        navToBackPage: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            clearInterval(this.interval);
            this.getView().byId("mainIconTabBar").setSelectedKey("OP");
            oRouter.navTo("shoporder", true);
        },
        handleRouteMatched: function (oEvent) {
            if (!this._checkRoute(oEvent, "mainpod")) {
                return;
            }
            this.interval = this.partiRefresh();
            this.update();
        },
        partiRefresh: function () {
            var that = this;
            return setInterval(function () {

                var link = "/XMII/Runner?Transaction=iGuzzini/Transaction/GetShopOrderInfo&orderID=" + that.shoporderid + "&Content-Type=text/xml&OutputParameter=output";

                //link = "model/machinesArea" + String(this.AREA) + ".json";
                jQuery.ajax({
                    url: link,
                    method: "GET",
                    async: false,
                    success: function (oData) {
                        //JSON.parse(oData.documentElement.textContent)[0].qtyDone;
                        var data = JSON.parse(oData.documentElement.textContent)[0];
                        var info = sap.ui.getCore().getModel().getData().informations;
                        info.qtydone = data.qtyDone;
                        that.test = new JSONModel();
                        that.test.setData(sap.ui.getCore().getModel().getData().informations);
                        that.getView().setModel(that.test);
                    },
                    error: function (oData) {
                        that.error(oData);
                    }
                });
            }, 5000);

        },
        SUCCESSInitInfo: function (Jdata) {

            MessageToast.show("yeah");
            /*sap.ui.getCore().getModel().getData().informations.qtydone;
             
             this.centerModel.setData(Jdata.Rowsets.Rowset[0].Row);
             this.selectedID = Jdata.Rowsets.Rowset[0].Row[0].ID;
             this.getView().setModel(this.centerModel, "centerModel");
             this.changeSwitch();
             this.centerModel.refresh(true);*/
        },
        FAILUREInitInfo: function () {
            //alert("error");
        },
        buttonsLogic: function (state) {
            var info = sap.ui.getCore().getModel().getData().informations;
            var buttonsID = ["startButton", "pausaButton", "completaButton"];
            for (var i = 0; i < buttonsID.length; i++) {
                this.getView().byId(buttonsID[i]).removeStyleClass("buttonSelected");
            }
            info.startButton = false;
            info.pausaButton = false;
            info.completaButton = false;
            info.setupButton = false;
            if (info.ena === "1") {
                switch (state) {
                    case "Start":
                        info.pausaButton = true;
                        info.completaButton = true;
                        this.getView().byId("startButton").addStyleClass("buttonSelected");
                        this.getView().byId("startButton").setEnabled(false);
                        this.getView().byId("pausaButton").setEnabled(true);
                        this.getView().byId("completaButton").setEnabled(true);
                        this.getView().byId("setupButton").setEnabled(false);
                        break;
                    case "Pausa":
                        info.startButton = true;
                        info.completaButton = true;
                        info.setupButton = true;
                        this.getView().byId("pausaButton").addStyleClass("buttonSelected");
                        this.getView().byId("startButton").setEnabled(true);
                        this.getView().byId("pausaButton").setEnabled(false);
                        this.getView().byId("completaButton").setEnabled(true);
                        this.getView().byId("setupButton").setEnabled(true);
                        break;
                    case "Completa":
                        info.setupButton = true;
                        this.getView().byId("completaButton").addStyleClass("buttonSelected");
                        this.getView().byId("startButton").setEnabled(false);
                        this.getView().byId("pausaButton").setEnabled(false);
                        this.getView().byId("completaButton").setEnabled(false);
                        this.getView().byId("setupButton").setEnabled(true);
                        break;
                    default:
                        info.startButton = true;
                        info.pausaButton = true;
                        info.completaButton = true;
                        info.setupButton = true;
                        this.getView().byId("startButton").setEnabled(true);
                        this.getView().byId("pausaButton").setEnabled(true);
                        this.getView().byId("completaButton").setEnabled(true);
                        this.getView().byId("setupButton").setEnabled(true);
                        break;
                }
            } else {
                this.getView().byId("completaButton").addStyleClass("buttonSelected");
                this.getView().byId("startButton").setEnabled(false);
                this.getView().byId("pausaButton").setEnabled(false);
                this.getView().byId("completaButton").setEnabled(false);
                this.getView().byId("setupButton").setEnabled(true);
            }
        },
        _checkRoute: function (evt, pattern) {
            if (evt.getParameter("name") !== pattern) {
                return false;
            }

            return true;
        },
        update: function () {
            if (typeof sap.ui.getCore().getModel().getData().informations != null) {
                Library.updateLastActionDate(this.user, this.plantid);

                this.initPod();
            } else {
                alert("error");
            }
        },
        SUCCESSInsertActivity: function (Jdata) {
            if (Jdata[0].result.errorMessage.indexOf("Errore") === -1) {
                this.buttonsLogic(this.buttonSource);
                MessageToast.show(Jdata[0].result.errorMessage, {duration: 2000});
            }
        },
        FAILUREInsertActivity: function () {
            MessageToast.show("Inserimento a log dell'attività fallito", {duration: 2000});
        },
        openSetupDialog: function () {
            if (!this._oDialogSetup) {
                this._oDialogSetup = sap.ui.xmlfragment("myapp.view.SendSetup", this);
            }
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogSetup);
            this._oDialogSetup.open();
        },
        sendSetupPP: function () {
            Library.updateLastActionDate(this.user, this.plant);

            //var transactionName = "XAC_GetAllWorkcenterByTypeAndUsername";
            var transactionName = "SetupPP/RecuperaPartProgram";

            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&cid=" + this.user + "&shoporderid=" + this.shoporderid + "&workcenterid=" + this.workcenterid;
            //var input = "&plant=1&type=A&user=" + this.user;
            var transactionCall = site + "/Transaction" + "/" + transactionName;
            var link = "/XMII/Runner?Transaction=" + transactionCall + input + "&Content-Type=text/html&OutputParameter=OutMsg";

            //link = "model/machinesArea" + String(this.AREA) + ".json";

            Library.AjaxCallerData(link, this.SUCCESSsendSetupPP.bind(this), this.FAILUREsendSetupPP.bind(this));
        },
        SUCCESSsendSetupPP: function (Jdata) {
            this.onExitSendSetup();
            if (isNaN(Jdata[0].result.error) || isNaN(Jdata[0].result.error1)) {
                MessageToast.show("LA MACCHINA NON RISPONDE" + Jdata[0].result.errorMessage + " - " + Jdata[0].result.errorMessage1);
            } else {
                if (Number(Jdata[0].result.error) !== 0) {
                    if (Jdata[0].result.error1 !== "" && Number(Jdata[0].result.error1) !== 0) {
                        MessageToast.show("SETUP NON INVIATO. GIOTTO: " + Jdata[0].result.errorMessage + " CAMPETELLA: " + Jdata[0].result.errorMessage1);
                    } else {
                        MessageToast.show("SETUP NON INVIATO. GIOTTO: " + Jdata[0].result.errorMessage);
                    }
                } else {
                    if (Number(Jdata[0].result.error1) !== 0 && Jdata[0].result.error1 !== "") {
                        MessageToast.show("SETUP NON INVIATO. CAMPETELLA: " + Jdata[0].result.errorMessage1);
                    } else {
                        MessageToast.show("SETUP INVIATO CORRETTAMENTE");
                    }
                }
            }
        },
        FAILUREsendSetupPP: function () {
            MessageToast.show("CONNESSIONE A BACKEND FALLITA");
        },
        performPause: function (rowSelected) {
            Library.updateLastActionDate(this.user, this.plantid);

            var transactionName = "PauseOperation";
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
        performStart: function (rowSelected) {
            Library.updateLastActionDate(this.user, this.plantid);

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
        performStop: function (rowSelected) {
            Library.updateLastActionDate(this.user, this.plantid);

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
            Library.updateLastActionDate(this.user, this.plantid);

            if (this._oDialog) {
                this._oDialog.close();
            }
        },
        onExitSendSetup: function () {
            if (this._oDialogSetup) {
                this._oDialogSetup.close();
            }
        },
        onExitDC: function () {
            Library.updateLastActionDate(this.user, this.plantid);

            if (this._oDialogDC) {
                this._oDialogDC.close();
            }
        },
        onExitSil: function () {
            if (this._oDialogSil) {
                this._oDialogSil.close();
            }
        },
        onExitPara: function () {

            if (this._oDialogEdit) {
                this._oDialogEdit.close();
            }
        },

        loggedDC: function (oEvent) {
            Library.updateLastActionDate(this.user, this.plantid);

            if (!this._oDialogDC) {
                this._oDialogDC = sap.ui.xmlfragment("myapp.view.LoggedDC", this);
            }
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogDC);


            //this.getView().setModel(this.getPhase(oEvent), 'phase');
            this._oDialogDC.setModel(this.getLoggedDC(oEvent));
            this._oDialogDC.open();
        },

        openChangeDialog: function (oEvent) {
            if (!this._oDialogEdit) {
                this._oDialogEdit = sap.ui.xmlfragment("myapp.view.EditEngParaDialog", this);
            }
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogEdit);


            //this.getView().setModel(this.getPhase(oEvent), 'phase');
            //this._oDialog.setModel(this.getLoggedDC(oEvent));
            var modelz = new JSONModel();
            modelz.setProperty("/", {
                "oldValue": oEvent.oSource.mProperties.number,
                "parameter": oEvent.oSource.mProperties.title
            });
            this._oDialogEdit.setModel(modelz);
            this._oDialogEdit.open();
        },
        openStatusMachine: function (oEvent) {
            Library.updateLastActionDate(this.user, this.plantid);

            var typemachine = sap.ui.getCore().getModel().getData().workcenter.typemachine;
            if (typemachine == 'S') {
                if (!this._oDialogSil) {
                    this._oDialogSil = sap.ui.xmlfragment("myapp.view.StatusMachineSil", this);
                }
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogSil);
                this._oDialogSil.setModel(this.getStatusMachineSil(oEvent));
                this._oDialogSil.open();
            } else {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("myapp.view.StatusMachineEng", this);
                }
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                this._oDialog.setModel(this.getStatusMachineEng(oEvent));
                this._oDialog.open();
            }
        },
        openGraph: function (oEvent) {
            /*if (!this._oDialog) {
             this._oDialog = sap.ui.xmlfragment("myapp.view.Main", this);
             }
             // toggle compact style
             jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
             
             
             //this.getView().setModel(this.getPhase(oEvent), 'phase');
             //this._oDialog.setModel(this.getLoggedDC(oEvent));
             this._oDialog.open();
             */
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main", true);

        },
        getLoggedDC: function (oEvent) {
            Library.updateLastActionDate(this.user, this.plantid);

            var oModel = new JSONModel();



            var transactionName = "XAC_GetLoggedDC";
            var that = this;
            var site = "iGuzzini";
            var input = "&plant=" + this.plantid + "&workcenterid=" + this.workcenterid;
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

        },
        getStatusMachineSil: function (oEvent) {
            var oModel = new JSONModel();
            var transactionName = "XAC_GetCurrentCommessaForSiliconatrice";
            var that = this;
            var site = "iGuzzini";
            var input = "&workcenterid=" + this.workcenterid;
            var transactionCall = site + "/XACQuery" + "/siliconatrice/" + transactionName;


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

            transactionName = "XAC_GetSiliconatriceMachineStatus";
            site = "iGuzzini";
            input = "&workcenterid=" + this.workcenterid + "&plantid=" + this.plantid;
            transactionCall = site + "/XACQuery" + "/siliconatrice/" + transactionName;


            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    oModel.setProperty("/status", {
                        "status": oData.Rowsets.Rowset[0].Row[0].Status,
                        "status_description": oData.Rowsets.Rowset[0].Row[0].Status_description,
                        "_TempoCicloProg": oData.Rowsets.Rowset[0].Row[0]._TempoCicloProg,
                        "TempoCicloUltimo": oData.Rowsets.Rowset[0].Row[0].TempoCicloUltimo,
                        "um_cabina": oData.Rowsets.Rowset[0].Row[0].um_cabina,
                        "temp_cabina": oData.Rowsets.Rowset[0].Row[0].temp_cabina
                    });

                },
                error: function (oData) {
                    that.error(oData);
                }
            });

            return oModel;

        },
        onNavBack: function () {
            var newModel = new JSONModel();
            this.getView().setModel(newModel);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("shoporder", true);
        },
        getStatusMachineEng: function (oEvent) {
            var oModel = new JSONModel();
            var transactionName = "XAC_GetEngelMachineStatus";
            var that = this;
            var site = "iGuzzini";
            var input = "&workcenterid=" + this.workcenterid;
            var transactionCall = site + "/XACQuery" + "/Engel/" + transactionName;
            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    oModel.setProperty("/", {
                        "para": JSON.parse(oData.Rowsets.Rowset[0].Row[0].Parameters_json),
                        "workcenter": oData.Rowsets.Rowset[0].Row[0].Workcenter,
                        "status": oData.Rowsets.Rowset[0].Row[0].SDescription
                    });
                    //oModel.setData(oModel);
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
