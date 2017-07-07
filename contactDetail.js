

(function () {

	var app = angular.module('contactApp');

	app.component('contactDetail', {
		controller: ContactDetail,
		controllerAs: 'cd',
		templateUrl: 'contactDetail.html',
		bindings: {
		}
	});

	app.controller('editContactModalController', EditContactModalController);

	ContactDetail.$inject = ['$state', '$stateParams', '$firebaseObject', '$uibModal'];
	EditContactModalController.$inject = ['$uibModalInstance', 'contact'];

	function ContactDetail($state, $stateParams, $firebaseObject, $uibModal) {

		var cd = this;
		var contactId = $stateParams.id;

		cd.edit = function () {
			
			var modal = $uibModal.open({
				controller: 'editContactModalController',
				controllerAs: 'emc',
				templateUrl: 'editContactModal.html',
				resolve: {
					contact: function () {
						return angular.copy(cd.contact);
					}
				}
			});

			modal.result.then(
				function (changedContact) {

					cd.contact.firstName = changedContact.firstName;
					cd.contact.lastName = changedContact.lastName;
					cd.contact.phone = changedContact.phone;

					cd.contact.$save();
				},
				function () {
					// cancelled
				}
			);
		};
		
		cd.delete = function () {
			cd.contact.$remove();
			$state.go('dashboard', { category: cd.category });
		};

		cd.$onInit = function () {

			var ref = firebase.database().ref().child('contacts').child(contactId);

			cd.contact = $firebaseObject(ref);

			cd.contact.$loaded()
				.then(function (data) {
					cd.category = cd.contact.category;
					//console.log(cd.category);
				})
				.catch(function (error) {
					//console.error("Error:", error);
				});
		}
	}

	function EditContactModalController($uibModalInstance, contact) {

		var emc = this;
		
		emc.errors = [];
		emc.contact = contact;

		emc.ok = function () {
			if (validate()) {
				$uibModalInstance.close(emc.contact);
			}	
		};

		emc.cancel = function () {
			$uibModalInstance.dismiss();
		};

		function validate() {

			emc.errors = [];
			
			if (!emc.contact.firstName) {
				emc.errors.push('A first name is required.');
			}			

			if (!emc.contact.phone) {
				emc.errors.push('A phone number is required.');
			}
			
			return emc.errors.length === 0;
		}
	}

})();
