jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "myapp/Component-preload",
	"modules": {
		"myapp/Component.js": "sap.ui.define([\"sap/ui/core/UIComponent\",\"./utils/ResConfigManager\"],function(t,e){\"use strict\";return t.extend(\"myapp.Component\",{metadata:{manifest:\"json\"},localeManager:new e,init:function(){t.prototype.init.apply(this,arguments),this.getRouter().initialize()}})},!0);",
		"myapp/controller/App.controller.js": "sap.ui.define([\"sap/ui/core/mvc/Controller\",\"./../utils/OdataManager\"],function(n,t){\"use strict\";return n.extend(\"myapp.controller.App\",{onInit:function(){t.__initialize(this.getOwnerComponent()),jQuery.sap.log.debug(\"APP starting!!!\")}})},!0);",
		"myapp/controller/Main.controller.js": "sap.ui.define([\"jquery.sap.global\",\"sap/m/MessageToast\",\"sap/ui/core/mvc/Controller\"],function(n,e,o){\"use strict\";return o.extend(\"myapp.controller.Main\",{onInit:function(){var e=n.sap.getUriParameters(window.location.href);console.log(e)},onAfterRendering:function(){},onToTmpPage:function(n){this.getOwnerComponent().getRouter().navTo(\"tmp\")}})});",
		"myapp/controller/Tmp.controller.js": "sap.ui.define([\"jquery.sap.global\",\"sap/m/MessageToast\",\"./../utils/OdataManager\",\"sap/ui/core/routing/History\",\"sap/ui/core/mvc/Controller\"],function(o,e,t,n,s){\"use strict\";return s.extend(\"myapp.controller.Tmp\",{oDataModel:null,onInit:function(){this.oDataModel=t.getOdata(),this.getView().setModel(this.oDataModel)},onAfterRendering:function(){},onNavBack:function(){void 0!==n.getInstance().getPreviousHash()?window.history.go(-1):sap.ui.core.UIComponent.getRouterFor(this).navTo(\"overview\",!0)},getInvoices:function(e){var t={context:null,urlParameters:null,success:function(o,e){console.log(\"success: \"+o)},error:function(o){console.log(\"error: \"+o)},filters:null,sorters:null,groupId:null,batchGroupId:null,headers:null};try{e.read(\"/Invoices\",t)}catch(e){o.sap.log.debug(e)}},onPress:function(o){this.getInvoices(this.oDataModel)}})});",
		"myapp/localService/mockserver.js": "sap.ui.define([\"jquery.sap.global\",\"sap/ui/core/util/MockServer\"],function(e,a){\"use strict\";return{init:function(){var t,r,o;t=new a({rootUri:\"/sap/opu/odata/SAP/ZAPP1_SRV/\"}),r=e.sap.getUriParameters(),a.config({autoRespond:!0,autoRespondAfter:r.get(\"serverDelay\")||1e3}),o=e.sap.getModulePath(\"myapp.localService\"),t.simulate(o+\"/metadata.xml\",o+\"/mockdata\"),t.start()}}});",
		"myapp/utils/OdataManager.js": "sap.ui.define([\"jquery.sap.global\",\"sap/ui/model/odata/ODataModel\",\"sap/ui/base/Object\"],function(t,a,n){\"use strict\";var e=null,o=n.extend(\"myapp.utils.OdataManager\",{_odata:null,__mainComponent:null,constructor:function(){if(null!==e)throw new Error(\"Cannot instantiate more than one OdataManager, use OdataManager.getInstance()\")},_getRemoteDatasourceURI:function(){var a,n=this.__mainComponent.getMetadata().getManifestEntry(\"sap.ui5\");return a=n.config.remoteDS,t.sap.log.debug(\"OdataManager: remoteDsURI=\"+a),a},__initialize:function(t){this.__mainComponent=t;var n=this._getRemoteDatasourceURI();this._odata=new a(n,{json:!0,useBatch:!0})},getOdata:function(){return this._odata}});return o.getInstance=function(){return null===e&&(e=new o),e},o.getInstance()});",
		"myapp/utils/ResConfigManager.js": "sap.ui.define([\"jquery.sap.global\",\"sap/ui/model/resource/ResourceModel\",\"sap/ui/base/Object\"],function(e,l,s){\"use strict\";return s.extend(\"myapp.utils.ResConfigManager\",{_localeResource:null,_resourceBundle:null,_sLocale:sap.ui.getCore().getConfiguration().getLanguage(),getLocale:function(){return null===this._localeResource&&(this._localeResource=new l({bundleUrl:\"locales/locale.properties\",bundleLocale:this._sLocale})),this._localeResource},getResourceBundle:function(){return null===this._resourceBundle&&(this._resourceBundle=e.sap.resources({url:\"locales/locale.properties\",locale:this._sLocale})),this._resourceBundle}})});",
		"myapp/view/App.view.xml": "<mvc:View xmlns=\"sap.m\" xmlns:mvc=\"sap.ui.core.mvc\" controllerName=\"myapp.controller.App\" displayBlock=\"true\"><App id=\"rootControl\"/></mvc:View>",
		"myapp/view/Main.view.xml": "<mvc:View xmlns:core=\"sap.ui.core\" xmlns:mvc=\"sap.ui.core.mvc\" xmlns:c=\"sap.ui.commons\" xmlns=\"sap.m\"\r\n          xmlns:l=\"sap.ui.layout\" xmlns:html=\"http://www.w3.org/1999/xhtml\" xmlns:t=\"sap.ui.table\"\r\n          controllerName=\"myapp.controller.Main\"><Page title=\"{locale>myapp.view.main.title}\"><headerContent><Button icon=\"sap-icon://log\" press=\"onAddPress\" text=\"Uscita\"\r\n                    ariaLabelledBy=\"exitButtonLabel\" class=\"sapUiSmallMarginEnd\"/></headerContent><content><Button text=\"{locale>myapp.goto.tmp}\" press=\"onToTmpPage\" class=\"sapUiSmallMarginEnd\"/></content></Page></mvc:View>\r\n",
		"myapp/view/Tmp.view.xml": "<mvc:View xmlns:core=\"sap.ui.core\" xmlns:mvc=\"sap.ui.core.mvc\" xmlns:c=\"sap.ui.commons\" xmlns=\"sap.m\"\r\n          xmlns:l=\"sap.ui.layout\" xmlns:html=\"http://www.w3.org/1999/xhtml\" xmlns:t=\"sap.ui.table\"\r\n          controllerName=\"myapp.controller.Tmp\"><Page title=\"{locale>myapp.view.tmp.title}\"><headerContent><Button icon=\"sap-icon://log\" press=\"onAddPress\" text=\"Uscita\"\r\n                    ariaLabelledBy=\"exitButtonLabel\" class=\"sapUiSmallMarginEnd\"/></headerContent><content><Button icon=\"sap-icon://arrow-left\" press=\"onNavBack\" text=\"{locale>myapp.view.tmp.back}\" /><Button icon=\"sap-icon://log\" press=\"onPress\" text=\"push me\" /><Table items=\"{/Invoices}\"><columns><Column width=\"11rem\" hAlign=\"Center\"><Text text=\"Invoice name\" /></Column><Column width=\"11rem\" hAlign=\"Center\"><Text text=\"Invoice quantity\" /></Column></columns><items><ColumnListItem><cells><Label text=\"{ProductName}\" /><Label text=\"{Quantity}\" /></cells></ColumnListItem></items></Table></content></Page></mvc:View>\r\n",
		"myapp/locales/locale.properties": "myapp.title=My App\r\nmyapp.view.main.title=Main View\r\nmyapp.view.tmp.title=Tmp View\r\nmyapp.description=My first app\r\nmyapp.goto.tmp=Goto Tmp\r\nmyapp.view.tmp.back=Back\r\n",
		"myapp/locales/locale_en.properties": "myapp.title=My App\r\nmyapp.view.main.title=Main View\r\nmyapp.view.tmp.title=Tmp View\r\nmyapp.description=My first app\r\nmyapp.goto.tmp=Goto Tmp\r\nmyapp.view.tmp.back=Back\r\n",
		"myapp/locales/locale_en_US.properties": "myapp.title=My App\r\nmyapp.view.main.title=Main View\r\nmyapp.view.tmp.title=Tmp View\r\nmyapp.description=My first app\r\nmyapp.goto.tmp=Goto Tmp\r\nmyapp.view.tmp.back=Back\r\n",
		"myapp/locales/locale_it.properties": "myapp.title=La mia app\r\nmyapp.view.main.title=Main View\r\nmyapp.view.tmp.title=Tmp View\r\nmyapp.description=La mia prima app\r\nmyapp.goto.tmp=Vai a Tmp\r\nmyapp.view.tmp.back=Indietro\r\n",
		"myapp/locales/locale_it_IT.properties": "myapp.title=La mia app\r\nmyapp.view.main.title=Main View\r\nmyapp.view.tmp.title=Tmp View\r\nmyapp.description=La mia prima app\r\nmyapp.goto.tmp=Vai a Tmp\r\nmyapp.view.tmp.back=Indietro\r\n"
	}
});