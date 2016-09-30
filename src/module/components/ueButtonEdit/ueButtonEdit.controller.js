(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonEditController',UeButtonEditController);

    UeButtonEditController.$inject = ['$scope','$element','RestApiService','$state', '$location'];

    function UeButtonEditController($scope,$element,RestApiService,$state, $location){
        var vm = this;
        var params;
        var request;


        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function() {
            watchRest();
        };

        vm.label = vm.setting.component.settings.label;

        var stateParams = {
            pk : vm.setting.entityId
        };

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }

            var stateOptions = {};
            
            //if($scope.entitySubtype){
            //    stateParams.type = $scope.entitySubtype;
            //    stateParams.back = $state.params.type;
            //    stateOptions.reload = true;
            //} else {
            //    stateParams.type = $state.params.type;
            //}
            //if ($location.search().parent) {
            //    stateParams.parent = $location.search().parent;
            //}
            $state.go(vm.setting.component.settings.state,stateParams, stateOptions);
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }

    }
})();