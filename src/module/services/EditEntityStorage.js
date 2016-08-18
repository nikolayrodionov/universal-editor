(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('EditEntityStorage',EditEntityStorage);

    EditEntityStorage.$inject = ['$rootScope','$timeout','configData','$location', '$state', '$stateParams'];

    function EditEntityStorage($rootScope,$timeout,configData,$location, $state, $stateParams){
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

        this.createNewEntity = function (params) {
            var entityObject = {};
            entityObject.editorEntityType = "new";

            angular.forEach(fieldControllers,function(fCtrl){
                angular.merge(entityObject,fCtrl.getInitialValue());
            });

            var search = params;
            var type = (!!search.type) ? search.type : $state.params.type;
            var entity_conf = undefined;
            var entityObjects = configData.entities.filter(function (item) {
                return (item.name === type);
            });

            if(entityObjects.length > 1) {
                entityObjects.forEach(function (item) {
                    if (item.lang === search.lang) {
                        entity_conf = item;
                    }
                });
            } else{
                entity_conf = entityObjects[0];
            }

            if (search.hasOwnProperty("parent") && !!search.parent) {
                entityObject[entity_conf.backend.fields.parent] = search.parent;
            }

            if(search['if-not-exist'] === 'create'){
                var id = 'id';
                var lang = 'lang';
                if(entity_conf.backend.hasOwnProperty('fields')){
                    id = !!entity_conf.backend.fields.primaryKey ? entity_conf.backend.fields.primaryKey : id;
                    lang = !!entity_conf.backend.fields.language ? entity_conf.backend.fields.language : lang;
                }
                entityObject[id] = params.uid;
                entityObject[lang] = search.lang;
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

        /* !PUBLIC METHODS */

        /* EVENTS LISTENING */

        $rootScope.$on("editor:add_entity", function (event,data) {
            self.actionType = data;
        });

        $rootScope.$on('editor:set_entity_type',function (event,type) {
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
