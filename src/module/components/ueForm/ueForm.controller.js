(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeFormController', UeFormController);

    function UeFormController($scope, ApiService, $location, $state, $translate, EditEntityStorage, $window, $timeout, $controller) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this,
            mixEntityObject,
            pkKey,
            pk;

        var defaultEditFooterBar = [
            {
                component: {
                    name: 'ue-button',
                    settings: {
                        label: $translate.instant('BUTTON.ACTIONS.SAVE'),
                        action: 'save',
                        useBackUrl: true,
                    }
                }
            },
            {
                component: {
                    name: 'ue-button',
                    settings: {
                        label: $translate.instant('BUTTON.ACTIONS.DELETE'),
                        action: 'delete',
                        useBackUrl: true,
                    }
                }
            },
            {
                component: {
                    name: 'ue-button',
                    settings: {
                        label: $translate.instant('BUTTON.ACTIONS.PRESAVE'),
                        action: 'presave'
                    }
                }
            }
        ];

        vm.$onInit = function() {
            //** Nested base controller */
            angular.extend(vm, $controller('BaseController', { $scope: $scope }));

            vm.componentSettings = vm.setting.component.settings;
            var dataSource = vm.componentSettings.dataSource;
            var header = vm.componentSettings.header;
            if (angular.isObject(header)) {
                vm.toolbar = header.toolbar;
                if (!angular.isArray(vm.toolbar)) {
                    vm.toolbar = [];
                }
            }
            vm.entityLoaded = false;
            vm.loaded = false;
            vm.errors = [];
            vm.entityId = '';
            vm.editorEntityType = 'new';
            vm.editFooterBar = [];
            vm.editFooterBarNew = [];
            vm.editFooterBarExist = [];
            vm.idField = 'id';
            vm.empty = vm.componentSettings === true;

            vm.width = !isNaN(+vm.componentSettings.width) ? vm.componentSettings.width : null;
            vm.classFormComponent = '.col-md-12.col-xs-12.col-sm-12.col-lg-12 clear-padding-left';

            if (!!vm.width) {
                if (vm.width > 12) {
                    vm.width = 12;
                }
                if (vm.width < 1) {
                    vm.width = 1;
                }
                vm.classFormComponent = 'col-lg-' + vm.width + ' col-md-' + vm.width + ' col-sm-' + vm.width + ' col-xs-' + vm.width + ' clear-padding-left';
            }

            vm.options = angular.copy(vm.options);
            angular.merge(vm.options, {
                isLoading: false,
                $componentId: vm.setting.component.$id,
                $dataSource: dataSource
            });

            pkKey = 'pk';
            pk = $state.params[pkKey];

            vm.options.isNewRecord = pk === 'new';

            if (dataSource && dataSource.hasOwnProperty('primaryKey')) {
                vm.idField = dataSource.primaryKey || vm.idField;
            }

            if (!!vm.componentSettings.footer && !!vm.componentSettings.footer.toolbar) {
                angular.forEach(vm.componentSettings.footer.toolbar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }

            if (vm.editFooterBar.length === 0 && !vm.componentSettings.footer) {
                angular.forEach(defaultEditFooterBar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }

            updateButton();

            vm.components = [];

            angular.forEach(vm.componentSettings.body, function(componentObject) {
                if (angular.isObject(componentObject) && componentObject.component) {
                    vm.components.push(componentObject);
                    if (componentObject.component.settings.dataSource === undefined) {
                        componentObject.component.settings.dataSource = dataSource;
                    }
                }
                if (angular.isString(componentObject)) {
                    var dataSourceComponent = dataSource.fields.filter(function(k) {
                        return k.name == componentObject;
                    })[0];
                    if (dataSourceComponent) {
                        vm.components.push(angular.merge({}, dataSourceComponent));
                    }
                }
            });


            if (dataSource) {
                if (pk !== 'new') {
                    ApiService.getItemById(pk || vm.setting.pk || null, vm.options).finally(function() {
                        vm.options.isLoading = false;
                    });
                }

                if (pk === 'new') {
                    vm.entityLoaded = true;
                    $timeout(function() {
                        EditEntityStorage.newSourceEntity(vm.options.$componentId, vm.setting.component.settings.dataSource.parentField);
                    });
                }
            } else {
                vm.entityLoaded = true;
            }

            $scope.$on('ue:beforeEntityCreate', vm.resetErrors);
            $scope.$on('ue:beforeEntityUpdate', vm.resetErrors);
            $scope.$on('ue:beforeEntityDelete', vm.resetErrors);
        };

        function updateButton() {
            pkKey = 'pk';
            pk = $state.params[pkKey];
            angular.forEach(vm.editFooterBar, function(button, index) {
                button.entityId = pk;
                if (pk === 'new') {
                    button.type = 'create';
                } else {
                    button.type = 'update';
                }
            });
        }

        $scope.$watch(function() {
            return $state.params;
        }, function(newVal) {
            updateButton();
        });

        $scope.$on('ue:componentDataLoaded', function(event, data) {
            if (vm.isParentComponent(data) && !event.defaultPrevented) {
                vm.editorEntityType = data.editorEntityType;
                vm.entityId = data[vm.idField];
                vm.entityLoaded = true;
            }
        });

        $scope.$on('ue:afterEntityUpdate', function(event, data) {
            if (data.action === 'presave') {
                vm.entityId = data;
                vm.editorEntityType = 'exist';
            }
        });
    }
})();