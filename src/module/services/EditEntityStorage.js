(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('EditEntityStorage',EditEntityStorage);

    EditEntityStorage.$inject = ['$rootScope','$timeout','configData','$location', "$state"];

    function EditEntityStorage($rootScope,$timeout,configData,$location, $state){
        var sourceEntity,
            configuredFields = {},
            fieldControllers = [],
            entityType,
            self = this;

        /* PUBLIC METHODS */

        this.actionType = "create";

        this.getValueField = function(fieldName) {
            for (var i = fieldControllers.length; i--;) {
                var controller = fieldControllers[i];
                if (controller.fieldName === fieldName) {
                    return controller.getFieldValue();
                }
            }
        };

        this.createNewEntity = function () {

            var entityObject = {};
            entityObject.editorEntityType = "new";
            var configObjectEntity = self.getEntity();
            angular.forEach(fieldControllers,function(fCtrl){
                angular.merge(entityObject,fCtrl.getInitialValue());
            });

            var search =  $location.search();       
            var type = search.type || $state.params.type;     
            if (search.hasOwnProperty("parent")) {
                var entity_conf = configData.entities.filter(function (item) {
                    return item.name === type;
                })[0];
                entityObject[entity_conf.backend.fields.parent] = search.parent;
            }

            $timeout(function () {
                $rootScope.$broadcast("editor:entity_loaded",entityObject);
            },0);
        };

        this.setSourceEntity = function (data) {
            data.editorEntityType = "exist";
            $rootScope.$broadcast("editor:entity_loaded",data);
        };

        this.getEntityType = function () {
            return entityType;
        };

        this.addFieldController = function (ctrl) {
            fieldControllers.push(ctrl);
            ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
        };

        this.deleteFieldController = function (ctrl) {
            angular.forEach(fieldControllers, function (fc, ind) {
                if (fc.$fieldHash === ctrl.$fieldHash){
                    fieldControllers.splice(ind,1);
                }
            });
        };

        this.setActionType = function (type) {
            this.actionType = type;
        };


        this.editEntityUpdate = function (type, request) {

            this.setActionType(type);

            var entityObject = {};

            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });

            switch (type) {
                case "create":
                    $rootScope.$emit('editor:create_entity',[entityObject, request]);
                    break;
                case "update":
                    $rootScope.$emit('editor:update_entity',[entityObject, request]);
                    break;
            }
        };

        this.editEntityPresave = function (request) {
            var entityObject = {};

            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });
            $rootScope.$emit('editor:presave_entity',[entityObject, request]);
        };

        this.getEntity = function(){
            return configData.entities.filter(function (item) {
                return item.name === entityType;
            })[0];
        };

        /* !PUBLIC METHODS */

        /* EVENTS LISTENING */

        $rootScope.$on("editor:add_entity", function (event,data) {
            self.actionType = data;
        });

        $rootScope.$on('editor:set_entity_type',function (event,type, lang) {
            entityType = type;
            fieldControllers = [];
        });

        /* !EVENTS LISTENING */

        /* PRIVATE METHODS */

        function validateEntityFields(){

            var valid = true;

            if (sourceEntity === undefined || entityType === undefined){
                console.log("EditEntityStorage: Сущность не доступна для проверки так как она не указана или не указан её тип");
                valid = false;
            }

            return valid;
        }

        /* !PRIVATE METHODS */
    }
})();
