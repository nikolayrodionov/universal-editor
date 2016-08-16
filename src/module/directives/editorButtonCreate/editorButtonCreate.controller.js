(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonCreateController',EditorButtonCreateController);

    EditorButtonCreateController.$inject = ['$scope','$element','EditEntityStorage','$location','$state'];

    function EditorButtonCreateController($scope,$element,EditEntityStorage,$location,$state){
        var vm = this;

        vm.label = $scope.buttonLabel;

        $element.bind("click", function () {
            if($location.search().hasOwnProperty("id")){
                $location.search("id",null);
            }

            var parentId = $location.search().parent !== '' ? $location.search().parent : undefined;

            var newPageType = $scope.type || $state.params.type;

            EditEntityStorage.createNewEntity();
            var params = {
                parent: parentId,
                type: newPageType
            };

            if(!!$location.search().lang){
                params.lang = $location.search().lang;
            }
            $state.go('editor.type.new',params);
        });
    }
})();
