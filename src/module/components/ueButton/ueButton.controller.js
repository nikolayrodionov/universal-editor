(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeButtonController', UeButtonController);

    function UeButtonController($scope, $rootScope, $element, $state, $location, EditEntityStorage, $timeout, $controller, $window, $httpParamSerializerJQLike, $translate, ApiService, FilterFieldsStorage) {
        'ngInject';
        $element.addClass('ue-button');

        var vm = this,
            state,
            request = {},
            url,
            pkKey = 'pk',
            pk,
            params = {},
            handlers;

        vm.$onInit = function() {
            var componentSettings = vm.setting.component.settings;
            handlers = componentSettings.handlers;
            angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
            vm.parentComponentId = vm.options.$componentId;
            vm.back = componentSettings.useBackUrl === true;
            vm.state = componentSettings.sref;
            vm.url = componentSettings.href;
            vm.method = componentSettings.method;
            vm.target = componentSettings.target;
            vm.action = componentSettings.action;
            vm.switchLoader = switchLoader;

            vm.isLoader = false;

            if (!vm.label && angular.isString(vm.action)) {
                $translate('BUTTON.ACTIONS.' + vm.action.toUpperCase()).then(function(translation) {
                    vm.label = translation;
                });
            }

            vm.setting.buttonClass = vm.setting.buttonClass || 'default';
            vm.click = clickLink;

            if (angular.isString(vm.action)) {
                vm.click = clickService;
                if (componentSettings.request) {
                    request = JSON.parse(componentSettings.request);
                }
                pk = $state.params[pkKey];
                if (vm.action === 'delete') {
                    vm.disabled = pk === 'new' || !pk;
                }
                request.method = vm.method;
                request.options = vm.options;
                request.state = vm.state;
                request.useBackUrl = vm.back;
                request.href = vm.url;
                $scope.$on('ue:afterEntityUpdate', function(event, data) {
                    if (data.action === 'presave' && !vm.options.isGrid && vm.isParentComponent(data)) {
                        vm.entityId = data[vm.options.$dataSource ? vm.options.$dataSource.primaryKey : 'id'];
                        vm.type = 'update';
                        if (vm.action === 'delete') {
                            vm.disabled = false;
                        }
                    }
                });
            } else {
                vm.entityId = vm.entityId || 'new';
                vm.method = vm.method || 'GET';
            }
        };

        function clickLink() {
            var params = {},
                state = vm.state,
                searchString = $location.search();

            if (vm.options.isLoading) {
                return;
            }

            if (vm.back && searchString && searchString.back) {
                state = searchString.back;
            }

            if (angular.isFunction(vm.action) && vm.options) {
                vm.action(vm.options.$componentId);
            }

            if (state) {
                params[pkKey] = vm.entityId;
                searchString.back = $state.current.name;
                if (vm.back) {
                    delete searchString.back;
                }
                $state.go(state, params).then(function() {
                    $location.search(searchString);
                    $timeout(function() {
                        var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
                        if (pk === 'new') {
                            EditEntityStorage.newSourceEntity(vm.options.$componentId, vm.options.$dataSource.parentField);
                        }
                    }, 0);
                });
            } else if (angular.isString(vm.url)) {
                if (!!vm.target) {
                    window.open(vm.url, vm.target);
                } else if (handlers && !angular.isFunction(vm.action)) {
                    sendRequest();
                } else {
                    url = url.replace(':pk', vm.entityId);
                    var isReload = !~url.indexOf($location.path());
                    params = $location.search();
                    params.back = $state.current.name;
                    var searchParams = $httpParamSerializerJQLike(params);
                    if (searchParams) {
                        searchParams = '?' + searchParams;
                    }
                    $window.location.href = url + searchParams;
                    if (isReload) {
                        $window.location.reload();
                    }
                }
            }
        }

        function switchLoader() {
            vm.isLoader = true;
            var loaderWatcher = $scope.$watch('vm.options.isLoading', function(value) {
                if (!value) {
                    vm.isLoader = false;
                    loaderWatcher();
                }
            });
        }

        function clickService() {
            if (vm.options.isLoading || (vm.disabled && vm.setting.buttonClass !== 'context')) {
                return;
            }
            switchLoader();
            angular.merge(request, handlers);
            switch (vm.action) {
                case 'save':
                    request.entityId = vm.entityId;
                    if (vm.entityId && vm.entityId !== 'new') {
                        vm.type = 'update';
                    }
                    if (vm.type == 'create') {
                        EditEntityStorage.editEntityUpdate('create', request);
                    } else if (vm.type == 'update') {
                        EditEntityStorage.editEntityUpdate('update', request);
                    }
                    break;
                case 'delete':
                    $translate('WARNING.DELETE_RECORD').then(function(translation) {
                        if (confirm(translation.replace('%id', vm.entityId))) {
                            request.entityId = vm.entityId;
                            request.setting = vm.setting;
                            ApiService.deleteItemById(request, vm.setting.buttonClass === 'context');
                        }
                    });
                    break;
                case 'presave':
                    request.entityId = vm.entityId;
                    EditEntityStorage.editEntityPresave(request);
                    break;
                case 'open':
                    var newRequest = {
                        id: vm.entityId,
                        options: vm.options,
                        url: vm.setting.url,
                        parentField: vm.setting.parentField,
                        $componentId: vm.options.$componentId
                    };
                    angular.merge(newRequest, handlers);
                    $rootScope.$broadcast('ue:parentEntitySet', newRequest);
                    break;
            }
        }

        function sendRequest() {
            var request = {
                url: vm.url,
                method: vm.method
            };
            angular.merge(request, handlers);
            ApiService.actionRequest(request);
        }

        vm.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };
    }
})();

