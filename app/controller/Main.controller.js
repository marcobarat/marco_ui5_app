sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'myapp/utils/ResConfigManager',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
    'myapp/utils/ModelManager',
    'sap/ui/core/mvc/Controller'
], function (jQuery, Filter, JSONModel, ResConfigManager, MessageBox, MessageToast, History, ModelManager, Controller) {
    "use strict";

    var MainController = Controller.extend("myapp.controller.Main", {
        resConfigManager: new ResConfigManager(),
        svgChart: null,
        timer: null,
        sfc: null,
        wc: null,
        res: null,
        gingo: new JSONModel({shift: "", datetime: ""}),
        onInit: function () {

            var model = new JSONModel();
            this.info = model;
            this.getView().setModel(model, "info");

            this.getView().setModel(this.gingo, "gingo");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("main").attachPatternMatched(this.exit, this);



        },
        onAfterRendering: function () {

            this.search();

            this.timer = setInterval(jQuery.proxy(this.search, this), 30 * 1000);

        },
        exit: function () {

            clearInterval(this.timer);
            this.timer = null;

        },
        search: function (event) {
            clearInterval(this.timer);
            this.timer = null;
            this.getData();

        },
        createChart: function (obj) {
            var time1 = [];
            var qta1 = [];
            var max = [];
            var min = [];

            time1.push("t1");
            qta1.push("Temperature");

            var qta2 = [];
            max.push("Max");
            min.push("Min");

            var i = 0;
            for (var time, cobj, len = obj.length; i < len; i++) {
                cobj = obj[i];
                time = new Date(cobj.HOUR + ".000Z").getTime();
                time1.push(Math.round(time / 1000));
                max.push(cobj.MAX);
                min.push(cobj.MIN);
                qta1.push(cobj.STANDARD);
            }

            var shift = obj[0].SHIFT;
            this.gingo.setProperty("/shift", shift);


            this.getChart(time1,max,min, qta1, shift);
        },
        _onObjectMatched: function (event) {

        },
        getData: function () {

            try {
                var datetime = this.getFormattedTime();
                this.gingo.setProperty("/datetime", datetime);
            } catch (err) {
                jQuery.sap.log.error(err);
            }


            var site = window.site;

            var that = this;


            var transactionName = "SimulateGraph";
            var transactionCall = 'iGuzzini' + "/" + "Transaction" + "/" + transactionName;
            //var userId = this.info.getProperty("/user/id");
            var params = {
                "TRANSACTION": transactionCall,
                "OutputParameter": "JSON"
            };
            try {
                var req = jQuery.ajax({
                    url: "/XMII/Runner",
                    data: params,
                    method: "POST",
                    dataType: "xml",
                    async: true
                });
                req.done(jQuery.proxy(that.getDataSuccess, that));
                req.fail(jQuery.proxy(that.getDataError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getDataSuccess: function (data, response) {

            try {
                sap.ui.core.BusyIndicator.hide();
                var jsonObjStr = jQuery(data).find("Row").text();
                var jsonObj = JSON.parse(jsonObjStr.trim());
                if (jsonObj.lenth && jsonObj.lenth === 0) {
                    jQuery.sap.log.error("cannot retrieve resource and sfc");
                }
                this.adjustLocations(jsonObj);

                this.createChart(jsonObj);
            } catch (err) {
                jQuery.sap.log.error(err);
            } finally {
                if (this.timer && this.timer !== null) {
                    clearInterval(this.timer);
                }
                this.timer = setInterval(jQuery.proxy(this.search, this), 3000);
            }

        },
        getDataError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        adjustLocations: function (objects) {


        },
        getChart: function (xdata1,max,min,
                ydata1, shift) {

            var that = this;

            if (null !== this.svgChart) {
                this.svgChart.destroy();
            }
            this.svgChart = window.c3.generate({
                bindto: "div[id$='chartBox']",
                padding: {
                    top: 20,
                    right: 100,
                    bottom: 90,
                    left: 100
                },
                size: {
                    height: 600
                },
                data: {
                    x: 't1',
                    columns: [
                        xdata1,
                        max,
                        ydata1,
                        min
                    ],
          
                    colors: {
                        Temperature: 'rgb(0, 194, 0)',
                        Max: 'red',
                        Min: 'red'
                    },
                    types: {
                        Temperature: 'line',
                        Max: 'line',
                        Min: 'line'
                    }
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    inset: {
                        anchor: 'top-right',
                        x: 20,
                        y: 40,
                        step: 2
                    }
                },
                axis: {
                    x: {
                        label: {
                            text: "Time",
                            position: 'inner-right'

                        },
                        tick: {
                            format: function (d) {
                                return that.toDate(d);
                            },
                            rotate: -10,
                            multiline: true,
                            fit: true,
                            outer: false
                        }
                    },
                    y: {
                        label: {
                            text: 'Qt\u00e0',
                            position: 'outer-top'
                        }
                    }
                },
                grid: {
                    x: {
                        show: true
                    },
                    y: {
                        show: true
                    }
                },
                onrendered: function () {
                    /*d3.selectAll(".c3-texts text").each(function (v) { // jshint ignore:line
                        var label = d3.select(this); // jshint ignore:line
                        if ("Standard" === v.id) {
                            if (ydata1[v.index + 1] > ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-20, -10)");
                            } else if (ydata1[v.index + 1] < ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-10, +30)");
                            } else {
                                label.attr("transform", "translate(-10, -10)");
                            }
                        }
                        if ("Effettivo" === v.id) {
                            if (ydata1[v.index + 1] > ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-10, +30)");
                            } else if (ydata1[v.index + 1] < ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-10, -10)");
                            } else {
                                label.attr("transform", "translate(-10, +30)");
                            }
                        }
                    });*/
                }
            });
        },
        onBack: function (event) {

        },
        toDate: function (seconds) {

            var date = new Date(seconds * 1000);

            var str = this.getFormattedTime(date);

            return str;
        },
        getFormattedTime: function (date) {
            if (!date) {
                date = new Date();
            }
            var currentdate = date;
            var datetime = +(currentdate.getDate() < 10) ? "0" + currentdate.getDate() : currentdate.getDate();
            datetime += "-";
            datetime += ((currentdate.getMonth() + 1) < 10) ? "0" + (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1);
            datetime += "-";
            datetime += currentdate.getFullYear();
            datetime += " ";
            datetime += (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
            datetime += ":";
            datetime += (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
            datetime += ":";
            datetime += (currentdate.getSeconds() < 10) ? "0" + currentdate.getSeconds() : currentdate.getSeconds();
            return datetime;
        }

    });

    return MainController;

});
