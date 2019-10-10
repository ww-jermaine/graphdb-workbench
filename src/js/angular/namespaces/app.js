import 'angular/core/services';
import 'angular/core/directives';
import 'angular/repositories/services';
import 'angular/namespaces/controllers';
import 'angular/namespaces/directives';
import 'angular-xeditable/dist/js/xeditable.min';

const modules = [
    'LocalStorageModule',
    'xeditable',
    'ngAnimate',
    'ngRoute',
    'toastr',
    'graphdb.framework.namespaces.controllers',
    'graphdb.framework.namespaces.directives',
    'graphdb.framework.repositories.services',
    'graphdb.framework.core.directives'
];
const namespacesApp = angular.module('graphdb.framework.namespaces', modules);

// namespacesApp.config(['$routeProvider', '$menuItemsProvider', function ($routeProvider, $menuItemsProvider) {
//     // $routeProvider.when('/namespaces', {
//     //     templateUrl: 'view/namespaces.html',
//     //     controller: 'NamespacesCtrl',
//     //     title: 'Namespaces',
//     //     helpInfo: 'The Namespaces view provides an overview of all namespaces used in your data. '
//     //     + 'Here you can add, remove and modify them. '
//     // });
//
//     console.log('INIT NAMESPACES MODULE: ');
//     // $menuItemsProvider.addItem({label: 'Setup', href: '#', order: 5, role: 'IS_AUTHENTICATED_FULLY', icon: "icon-settings"});
//     // $menuItemsProvider.addItem({label: 'Namespaces', href: 'namespaces', order: 30, parent: 'Setup'});
//
// }]);

namespacesApp.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);
