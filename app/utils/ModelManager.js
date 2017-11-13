sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/base/Object' 
], function (jQuery, JSONModel, Object) {
    "use strict";
    var instance = null;
    var ModelManager = Object.extend("myapp.utils.ModelManager", {
        NAMES: {
            machineModel: "machineModel",
            shoporderModel: "shoporderModel",
            folderModel: "folderModel",
        },
        _myModels: {},
        createNewMachineModel: function () {

            this._myModels[this.NAMES.machineModel] = new JSONModel(
                    {
                        "workcenter": {"name": "", "id": "", "description":""},
                        "user": {"name": "", "id": ""}
                    }
            );
        },
        emptyMachineModel: function () {
            this._myModels[this.NAMES.machineModel].setData(
                    {
                        "workcenter": {"name": "", "id": "", "description":""},
                        "user": {"name": "", "id": ""}
                    }
            );
            this.emptyVinModel();
            this.emptyMainPodModel();
        },
        getModel: function (modelName) {

            return this._myModels[modelName];
        },
        assignModelToView: function (view, obj, modelName) {

            if (undefined === modelName || null === modelName) {
                if (view.getModel() === undefined || null === view.getModel()) {
                    view.setModel(new JSONModel(obj));
                } else {
                    view.getModel().setData(obj);
                }
                view.getModel().refresh(true);
            } else {
                if (view.getModel(modelName) === undefined || null === view.getModel(modelName)) {
                    view.setModel(new JSONModel(obj), modelName);
                } else {
                    view.getModel(modelName).setData(obj);
                }
                view.getModel(modelName).refresh(true);
            }
        },
        __mainComponent: null,
        constructor: function () {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one ModelManager, use ModelManager.getInstance()");
            }
        },
        __initialize: function (mainComponent) {

            this.__mainComponent = mainComponent;
            this.createNewMachineModel();
        }

    });
    ModelManager.getInstance = function () {

        if (instance === null) {
            instance = new ModelManager();
        }
        return instance;
    };
    return ModelManager.getInstance();
}, /* bExport= */ true);
