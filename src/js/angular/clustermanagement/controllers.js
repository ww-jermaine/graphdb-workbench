import 'angular/core/services';
import 'angular/rest/cluster.rest.service';
import {CLUSTER_TOOLTIPS} from "./cluster-management.constants";

const modules = [
    'ui.bootstrap',
    'graphdb.framework.core.services.repositories',
    'graphdb.framework.rest.repositories.service',
    'graphdb.framework.rest.cluster.service',
    'toastr'
];

angular
    .module('graphdb.framework.clustermanagement.controllers', modules)
    .controller('ClusterManagementCtrl', ClusterManagementCtrl)
    .controller('CreateClusterGroupCtrl', CreateClusterGroupCtrl)
    .controller('EditClusterGroupCtrl', EditClusterGroupCtrl);

ClusterManagementCtrl.$inject = ['$scope', '$http', '$q', 'toastr', '$repositories', '$modal', '$sce',
    '$window', '$interval', 'ModalService', '$timeout', 'ClusterRestService', 'RepositoriesRestService', '$location'];

function ClusterManagementCtrl($scope, $http, $q, toastr, $repositories, $modal, $sce,
    $window, $interval, ModalService, $timeout, ClusterRestService, RepositoriesRestService, $location) {
    // TODO: Similar function is declared multiple times in different components. Find out how to avoid it!
    $scope.setLoader = function (loader, message) {
        $timeout.cancel($scope.loaderTimeout);
        if (loader) {
            $scope.loaderTimeout = $timeout(function () {
                $scope.loader = loader;
                $scope.loaderMessage = message;
            }, 300);
        } else {
            $scope.loader = false;
        }
    };

    $scope.getLoaderMessage = function () {
        return $scope.loaderMessage || 'Loading...';
    };

    $scope.createClusterGroup = function () {
        $location.path(`${$location.path()}/create`);
    };

    $scope.getClusterConfiguration = () => {
        $scope.setLoader(true);
        ClusterRestService.getGroupConfig()
            .success((data, status) => {
                console.log('Cluster API responded with: ' + status, data);
                $scope.clusterConfiguration = data;
            })
            .error((data, status) => {
                console.log('Cluster API responded with: ' + status, data);
                $scope.clusterConfiguration = null;
            })
            .finally(() => {
                $scope.setLoader(false);
            });
    };

    $scope.getClusterStatus = function () {
        ClusterRestService.getGroupStatus()
            .success(function (data, status) {
                if (!$scope.clusterConfiguration) {
                    $scope.getClusterConfiguration();
                    return;
                }
                console.log(status, data);

                $scope.leader = data.find((node) => node.nodeState === 'LEADER');

                if ($scope.leader) {
                    $scope.followers = data.filter((node) => node !== $scope.leader);
                    $scope.followers.forEach((node) => {
                        console.log(node);
                        node.syncStatus = $scope.leader.syncStatus[node.address];
                    });
                } else {
                    $scope.followers = data;
                }
            })
            .error(function (data, status) {
                console.log(status, data);
                if (status === 404) {
                    $scope.groupConfiguration = null;
                }
            });
    };

    $scope.showDeleteDialog = () => {
        ModalService.openSimpleModal({
            title: 'Cluster group delete confirmation',
            message: `<p>Are you sure you want to delete the cluster group configuration?</p>`,
            warning: true
        }).result
            .then(() => {
                $scope.setLoader(true, 'Deleting cluster group');
                // TODO: Handle cases when group can not be deleted and add force delete
                ClusterRestService.deleteGroupConfig()
                    .success((data, status) => {
                        console.log(data);
                        const notDeleted = {};
                        Object.keys(data).forEach((key) => {
                            if (data[key] !== 'DELETED') {
                                notDeleted[key] = `Node ${key} - ${data[key]}`;
                            }
                        });
                        if (Object.keys(notDeleted).length === 0) {
                            toastr.success('Cluster group deleted successfully');
                        } else {
                            toastr.success(notDeleted, 'Not all nodes are deleted');
                        }
                        $scope.getClusterConfiguration();
                    })
                    .error((status, data) => {
                        console.log(status, data);
                        toastr.error('Can not delete cluster group');
                    })
                    .finally(() => $scope.setLoader(false));
            });
    };

    $scope.getClusterConfiguration();
    $scope.getClusterStatus();

    let timerCounter = 0;
    const timer = $interval(function () {
        if (timerCounter % 3 === 0) {
            $scope.getClusterConfiguration();
        }
        timerCounter++;
        if ($scope.clusterConfiguration) {
            $scope.getClusterStatus();
        }
    }, 2000);

    $scope.$on("$destroy", function () {
        $interval.cancel(timer);
    });
}

CreateClusterGroupCtrl.$inject = ['$scope', '$routeParams', '$location', '$timeout', 'ClusterRestService', 'toastr'];

function CreateClusterGroupCtrl($scope, $routeParams, $location, $timeout, ClusterRestService, toastr) {
    $scope.pageTitle = 'Create cluster group';
    $scope.clusterTooltips = CLUSTER_TOOLTIPS;
    $scope.autofocusId = 'autofocus';

    $scope.errors = [];

    $scope.getLoaderMessage = function () {
        return $scope.loaderMessage || 'Loading...';
    };

    $scope.clusterGroup = {
        electionMinTimeout: 1500,
        electionRangeTimeout: 2000,
        heartbeatInterval: 500,
        messageSizeKB: 64,
        nodes: ['yordan:7300', 'yordan:7301'],
        verificationTimeout: 1500
    };

    $scope.goToClusterManagementPage = function () {
        $location.path('/cluster');
    };

    $scope.createClusterGroup = function () {
        if (!validateGroup()) {
            return;
        }
        $scope.setLoader(true, 'Creating cluster group ...');
        ClusterRestService.createGroupConfig($scope.clusterGroup)
            .success(function (data, status) {
                toastr.success('Cluster group created successfully');
                const timer = $timeout(function () {
                    $scope.setLoader(false);
                    $scope.goToClusterManagementPage();
                }, 2000);
                $scope.$on('$destroy', function () {
                    $timeout.cancel(timer);
                });
            })
            .error(function (data, status) {
                handleErrors(data, status);
                $scope.setLoader(false);
            });
    };

    function handleErrors(data, status) {
        delete $scope.preconditionErrors;
        $scope.errors.splice(0);
        if (status === 412) {
            $scope.preconditionErrors = Object.keys(data).map((key) => `${key} - ${data[key]}`);
        } else if (status === 400) {
            $scope.errors.push(...data);
        }
    }

    $scope.setLoader = function (loader, message) {
        $timeout.cancel($scope.loaderTimeout);
        if (loader) {
            $scope.loaderTimeout = $timeout(function () {
                $scope.loader = loader;
                $scope.loaderMessage = message;
            }, 300);
        } else {
            $scope.loader = false;
        }
    };

    function validateGroup() {
        return $scope.clusterGroup.nodes && $scope.clusterGroup.nodes.length;
    }

    $scope.addNodeToList = function (nodeRpcAddress) {
        if (!nodeRpcAddress || $scope.clusterGroup.nodes.includes(nodeRpcAddress)) {
            return;
        }
        $scope.clusterGroup.nodes.push(nodeRpcAddress);
        $scope.rpcAddress = '';
    };

    $scope.removeNodeToList = function (index) {
        $scope.clusterGroup.nodes.splice(index, 1);
    };
}

EditClusterGroupCtrl.$inject = ['$scope'];

function EditClusterGroupCtrl($scope) {
    $scope.pageTitle = 'Edit cluster group';
    $scope.editClusterGroup = true;
}
