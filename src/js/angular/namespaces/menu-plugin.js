angular
    .module('graphdb.framework.namespaces', [])
    .factory('NamespacesMenuPlugin', NamespacesMenuPlugin);

NamespacesMenuPlugin.$inject = ['$menuItemsProvider'];

function NamespacesMenuPlugin($menuItemsProvider) {
    return (function() {
        $menuItemsProvider.addItem({label: 'Setup', href: '#', order: 5, role: 'IS_AUTHENTICATED_FULLY', icon: "icon-settings"});
        $menuItemsProvider.addItem({label: 'Namespaces', href: 'namespaces', order: 30, parent: 'Setup'});
    })();
}
