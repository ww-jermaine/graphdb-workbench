angular
    .module('graphdb.framework.repositories.services.test', [])
    .factory('TestService', TestService);

function TestService() {
    return {
        useScope: useScope
    };

    function useScope(scope) {
        return scope.getActiveRepository();
    }
}
