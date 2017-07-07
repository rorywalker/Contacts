

(function () {
	var app = angular.module('contactApp', ['ui.router', 'firebase', 'ui.bootstrap']);

	app.config(RouteConfiguration);

	RouteConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];

	function RouteConfiguration($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/dashboard/Family');

		$stateProvider
			.state('dashboard', {
				url: '/dashboard/:category',
				component: 'contactList'
			})
			.state('contact', {
				url: '/contact/:id',
				component: 'contactDetail'
			});
	}
})();
