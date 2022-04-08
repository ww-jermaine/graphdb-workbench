PluginRegistry.add('route', [
    {
        'url': '/cluster',
        'module': 'graphdb.framework.clustermanagement',
        'chunk': 'clustermanagement',
        'path': 'clustermanagement/app',
        'controller': 'ClusterManagementCtrl',
        'templateUrl': 'pages/cluster-management/clusterInfo.html',
        'helpInfo': 'The Cluster management view is a visual administration tool '
            + 'for the GraphDB cluster. Here you can create, modify and delete '
            + 'a cluster group or you can use it to monitor the state of a running '
            + 'cluster in near real time. ',
        'title': 'Cluster management'
    }, {
        'url': '/cluster/create',
        'module': 'graphdb.framework.clustermanagement',
        'path': 'clustermanagement/app',
        'chunk': 'clustermanagement',
        'controller': 'CreateClusterGroupCtrl',
        'templateUrl': 'pages/cluster-management/cluster-group.html',
        'title': 'Create cluster group'
    }, {
        'url': '/cluster/edit',
        'module': 'graphdb.framework.clustermanagement',
        'path': 'clustermanagement/app',
        'chunk': 'clustermanagement',
        'controller': 'EditClusterGroupCtrl',
        'templateUrl': 'pages/cluster-management/cluster-group.html',
        'title': 'Edit cluster group'
    }
]);

PluginRegistry.add('main.menu', {
    'items': [{
        label: 'Cluster',
        href: 'cluster',
        order: 20,
        role: 'ROLE_ADMIN',
        parent: 'Setup',
        children: [{
            href: 'cluster/create',
            children: []
        }]
    }]
});

