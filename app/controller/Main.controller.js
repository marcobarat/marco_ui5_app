sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	'sap/ui/core/Fragment',
	"sap/ui/core/format/DateFormat"
], function(Controller, JSONModel, MessageToast, Fragment, DateFormat) {
	"use strict";
        var _timeout;

	return Controller.extend("myapp.controller.Main", {
		onInit : function () {
			// set explored app's demo model on this sample
			var oJSONModel = this.initSampleDataModel();
			this.getView().setModel(oJSONModel);
		},
                /*onAfterRendering: function(){
                        var yourControl =  sap.ui.getCore().byId("__xmlview1--tab1");
                        alert(yourControl);
                        var f = function(evt) {
                            alert("click");
                        };
                        yourControl.cellClick(f);
                },*/
                
                clickCell : function(oControlEvent){
                    var yourControl =   this.getView().byId("tab1");
                    var columnIndex = oControlEvent.mParameters.columnIndex;
                    var rowIndex = oControlEvent.mParameters.rowIndex;
                    alert("click on "+oControlEvent.getParameters().cellControl.mProperties.text);

                },
		initSampleDataModel : function() {
			var oModel = new JSONModel();
 
			var oDateFormat = DateFormat.getDateInstance({source: {pattern: "timestamp"}, pattern: "dd/MM/yyyy"});
 
			jQuery.ajax(jQuery.sap.getModulePath("myapp", "model/products.json"), {
				dataType: "json",
				success: function (oData) {
					var aTemp1 = [];
					var aTemp2 = [];
					var aSuppliersData = [];
					var aCategoryData = [];
					for (var i=0; i<oData.ProductCollection.length; i++) {
						var oProduct = oData.ProductCollection[i];
						if (oProduct.SupplierName && jQuery.inArray(oProduct.SupplierName, aTemp1) < 0) {
							aTemp1.push(oProduct.SupplierName);
							aSuppliersData.push({Name: oProduct.SupplierName});
						}
						if (oProduct.Category && jQuery.inArray(oProduct.Category, aTemp2) < 0) {
							aTemp2.push(oProduct.Category);
							aCategoryData.push({Name: oProduct.Category});
						}
						oProduct.DeliveryDate = (new Date()).getTime() - (i%10 * 4 * 24 * 60 * 60 * 1000);
						oProduct.DeliveryDateStr = oDateFormat.format(new Date(oProduct.DeliveryDate));
						oProduct.Heavy = oProduct.WeightMeasure > 1000 ? "true" : "false";
						oProduct.Available = oProduct.Status == "Available" ? true : false;
					}
 
					oData.Suppliers = aSuppliersData;
					oData.Categories = aCategoryData;
 
					oModel.setData(oData);
				}.bind(this),
				error: function () {
					jQuery.sap.log.error("failed to load json");
				}
			});
 
			return oModel;
		},
 
		formatAvailableToObjectState : function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		},
 
		formatAvailableToIcon : function(bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},
 
		handleDetailsPress : function(oEvent) {
			MessageToast.show("Details for product with id " + this.getView().getModel().getProperty("ProductId", oEvent.getSource().getBindingContext()));
		},
                understand : function(oEvent) {
                    alert("ciao anche a te "+sap.ui.getCore().byId(oEvent.getParameters().id).getProperty("text"));
                    console.log(oEvent);
                },
		onOpenDialog: function (oEvent) {
                        var that = this;
			// instantiate dialog
			if (!this._dialog) {
                            this._dialog = sap.ui.xmlfragment("myapp.view.BusyDialog", this);
                            this.getView().addDependent(this._dialog);
			}
 
			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();
                        this.returnName(that);
			// simulate end of operation
			
		},
                
		returnName: function (q) {
                        var that = this;
			var name;
                        $.ajax({
                           url: 'http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
                           data: {
                              format: 'json'
                           },
                           error: function() {
                               var yourControl =   that.getView().byId("tab1");
                               yourControl.setTitle("errore");
                           },
                           dataType: 'jsonp',
                           success: function(data) {
                               var yourControl =   that.getView().byId("tab1");
                               yourControl.setTitle(data[0].word);
                               that._dialog.close();
                           },
                           type: 'GET'
                        });
		},
 
		onDialogClosed: function (res) {
                        var that = this;
			if (res == "errore") {
				MessageToast.show("The operation has been cancelled");
			} else {
				MessageToast.show("The operation has been completed");
			}
                        
		}
 
	});
 
});