(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonEditController',EditorButtonEditController);

    EditorButtonEditController.$inject = ['$scope','$element','RestApiService','$state', '$location'];

    function EditorButtonEditController($scope,$element,RestApiService,$state, $location){
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

        $scope.$on('$destroy', function () {
            watchRest();
        });

        vm.label = $scope.buttonLabel;


        $element.bind("click", function () {
            if(vm.processing){
                return;
            }

            var stateParams = {
                uid : $scope.entityId
            };

            var stateOptions = {};
            
            if($scope.entitySubtype){
                stateParams.type = $scope.entitySubtype;
                stateParams.back = $state.params.type;
                stateOptions.reload = true;
            } else {
                stateParams.type = $state.params.type;
            }
            if ($location.search().parent) {
                stateParams.parent = $location.search().parent;
            }
            if(!!$location.search().lang){
                stateParams.lang = $location.search().lang;
            }
            $state.go('editor.type.entity',stateParams, stateOptions);
        });
    }
})();