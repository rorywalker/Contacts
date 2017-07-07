

(function () {

    var app = angular.module('contactApp');

    app.component('userProfile', {
		controller: UserProfile,
		controllerAs: 'up',
		templateUrl: 'userProfile.html'
	});

    app.controller('loginModalController', LoginModalController);

	UserProfile.$inject = ['$uibModal', '$firebaseAuth'];

    function UserProfile ($uibModal, $firebaseAuth) {

		var up = this;

        var auth = $firebaseAuth();

        up.user = null;

        auth.$onAuthStateChanged(function (firebaseUser) {
            up.user = firebaseUser;
        });

        up.login = function () {

        var modal = $uibModal.open({
            controller: 'loginModalController',
            controllerAs: 'lm',
            templateUrl: 'loginModal.html'
        });
        
        modal.result.then (
            function (credentials) {

                auth.$signInWithEmailAndPassword(credentials.email, credentials.password)
                    .then (function (firebaseUser){
                        up.user = firebaseUser;
                        //console.log("Signed in as:", firebaseUser.uid);
                    })
                    .catch (function (error){
                        //console.error("Authentication failed", error);
                    });

            },
            function () {
                // cancelled
            }
        );

    },
            up.logout = function () {
                auth.$signOut();
            }
    }

    function LoginModalController($uibModalInstance) {
        var lm = this;

        lm.errors = [];
        lm.credentials = {
            email: '',
            password: ''
        };

        lm.ok = function () {
            if (validate()) {
                $uibModalInstance.close(lm.credentials);
            }
        };

        lm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function validate () {
            lm.errors = [];

            if (!lm.credentials.email) {
                lm.errors.push('An email address is required.');
            }

            if (!lm.credentials.password) {
                lm.errors.push('A password is required.');
            }
            return lm.errors.length === 0;
        }

    }

})();



