(function () {
    'use strict';

    angular
        .module('universal.editor')
        .provider('ConfigDataProvider', ConfigDataProvider);

    ConfigDataProvider.$inject = ['configData'];
    function ConfigDataProvider(configData){
        return {
            getNameDefaultEntity: function(){
                return configData.entities[0].name;
            },
            getLangDefaultEntity: function(){
              return (!!configData.entities[0].lang) ? ('?lang=' + configData.entities[0].lang) : '';
            },
            $get: ['$q',function($q) {
                var deferred = $q.defer();
                deferred.resolve(configData);
                return deferred;
            }]
        };
    }
})();
