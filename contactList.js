

(function () {

	var app = angular.module('contactApp');

	app.component('contactList', {
		controller: ContactList,
		controllerAs: 'cl',
		templateUrl: 'contactList.html'
	});

	app.controller('addContactModalController', AddContactModalController);

	ContactList.$inject = ['$firebaseArray', '$stateParams', '$uibModal'];
	AddContactModalController.$inject = ['$uibModalInstance'];

	function ContactList($firebaseArray, $stateParams, $uibModal) {

		var cl = this;

		cl.$onInit = function () {

			cl.category = $stateParams.category || 'All';

			var ref = null;

			if (cl.category === 'All') {
				ref = firebase.database().ref().child('contacts');
			}
			else {
				ref = firebase.database().ref().child('contacts')
					.orderByChild('category')
					.equalTo(cl.category);
			}

			cl.contacts = $firebaseArray(ref);

			//console.log($stateParams);
		}

		cl.addContact = function () {

			var modal = $uibModal.open({
				controller: 'addContactModalController',
				controllerAs: 'cmc',
				templateUrl: 'addContactModal.html'
			});

			modal.result.then(
				function (newContact) {

					newContact.category = cl.category;

					cl.contacts.$add(angular.copy(newContact));
				},
				function () {
					// cancelled
				}
			);
		}

		cl.deleteContact = function (index) {

			var contact = cl.contacts[index];

			cl.contacts.$remove(contact);
		}
		
	}

	function AddContactModalController($uibModalInstance) {

		var cmc = this;

		cmc.errors = [];		
		cmc.newContact = {
			firstName: '',
			lastName: '',
			phone: ''
		};

		cmc.ok = function () {
			if (validate()) {
				$uibModalInstance.close(cmc.newContact);
			}	
		};

		cmc.cancel = function () {
			$uibModalInstance.dismiss();
		};

		function validate() {

			cmc.errors = [];
			
			if (!cmc.newContact.firstName) {
				cmc.errors.push('A first name is required.');
			}			

			if (!cmc.newContact.phone) {
				cmc.errors.push('A phone number is required.');
			}
			
			return cmc.errors.length === 0;
		}
	}

})();
