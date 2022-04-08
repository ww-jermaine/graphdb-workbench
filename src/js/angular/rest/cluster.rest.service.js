angular
    .module('graphdb.framework.rest.cluster.service', [])
    .factory('ClusterRestService', ClusterRestService);

ClusterRestService.$inject = ['$http'];

// const CLUSTER_MASTERS_ENDPOINT = 'rest/cluster/masters';
const CLUSTER_GROUP_ENDPOINT = 'rest/cluster';

function ClusterRestService($http) {
    return {
        getGroupConfig,
        createGroupConfig,
        deleteGroupConfig,
        addNodesToGroup,
        removeNodesFromGroup,
        getGroupStatus,
        getNodeStatus
    };

    function getGroupConfig() {
        return $http.get(`${CLUSTER_GROUP_ENDPOINT}/config`);
    }

    function createGroupConfig(groupConfiguration) {
        return $http.post(`${CLUSTER_GROUP_ENDPOINT}/config`, groupConfiguration);
    }

    function deleteGroupConfig() {
        return $http.delete(`${CLUSTER_GROUP_ENDPOINT}/config`);
    }

    function addNodesToGroup(nodesArray) {
        return $http.post(`${CLUSTER_GROUP_ENDPOINT}/config/node`, nodesArray);
    }

    function removeNodesFromGroup(nodesArray) {
        return $http.delete(`${CLUSTER_GROUP_ENDPOINT}/config/node`, nodesArray);
    }

    function getGroupStatus() {
        return $http.get(`${CLUSTER_GROUP_ENDPOINT}/group/status`);
    }

    function getNodeStatus() {
        return $http.get(`${CLUSTER_GROUP_ENDPOINT}/node/status`);
    }

/*    function getMaster(masterRepositoryID, data = {}) {
        return $http.get(`${CLUSTER_MASTERS_ENDPOINT}/${masterRepositoryID}`, data);
    }

    function configureMaster(master, location, data) {
        return $http({
            url: `${CLUSTER_MASTERS_ENDPOINT}/${master}?masterLocation=${encodeURIComponent(location)}`,
            method: 'POST',
            data
        });
    }

    function cloneRepository(data) {
        return $http.post('rest/cluster/nodes/clone', {
            cloningNodeLocation: data.currentNodeLocation,
            cloningNodeRepositoryID: data.selectedNodeName,
            newNodeRepositoryID: data.repositoryID,
            newNodeLocation: data.locationUri,
            newNodeTitle: data.repositoryTitle
        });
    }

    function connectWorker(master, masterLocation, workerLocation) {
        return $http({
            url: `${CLUSTER_MASTERS_ENDPOINT}/${master}/workers/`,
            method: 'POST',
            data: {
                workerURL: workerLocation,
                masterLocation: masterLocation
            }
        });
    }

    function disconnectWorker(master, params) {
        return $http({
            url: `${CLUSTER_MASTERS_ENDPOINT}/${master}/workers?${params}`,
            method: 'DELETE',
            dataType: 'text'
        });
    }

    function disconnectNodes(master, params) {
        return $http({
            url: `${CLUSTER_MASTERS_ENDPOINT}/${master}/peers?${params}`,
            method: 'DELETE',
            dataType: 'text'
        });
    }

    function connectNodes(master, data) {
        return $http({
            url: `${CLUSTER_MASTERS_ENDPOINT}/${master}/peers`,
            method: 'POST',
            data
        });
    }*/
}
