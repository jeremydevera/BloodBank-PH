angular.module('userControllers', ['userServices'])


	.controller('regCtrl', function($http, $location, $timeout, User, Bloodbankchapter) {
		Bloodbankchapter.getBloodbankchapters().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                    app.bloodbankchapters = data.data.bloodbankchapters; // Assign users from database to variable                
                    app.loading = false; // Stop loading icon
                    app.accessDenied = false; // Show table
                    // Check if logged in user is an admin or moderator
         
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
		
		// Custom function that registers the user in the database		
		var app = this;
		this.regUser = function(regData, valid, confirmed) {
			app.disabled = true; // Disable the form when user submits to prevent multiple requests to server
			app.loading = true; // Activate bootstrap loading icon
			app.errorMsg = false; // Clear errorMsg each time user submits

			// If form is valid and passwords match, attempt to create user			
			if (valid && confirmed) {
				// Runs custom function that registers the user in the database	
				User.create(app.regData).then(function(data) {
					// Check if user was saved to database successfully
					if (data.data.success) {
						app.loading = false; // Stop bootstrap loading icon
						app.successMsg = data.data.message + '...Redirecting'; // If successful, grab message from JSON object and redirect to login page
						// Redirect after 2000 milliseconds (2 seconds)
						$timeout(function() {
							$location.path('/superadmin_user_accounts');
						}, 2000);
					} else {
						app.loading = false; // Stop bootstrap loading icon
						app.disabled = false; // If error occurs, remove disable lock from form
						app.errorMsg = data.data.message; // If not successful, grab message from JSON object
					}
				});
			} else {
				app.disabled = false; // If error occurs, remove disable lock from form
				app.loading = false; // Stop bootstrap loading icon
				app.errorMsg = 'Please ensure form is filled our properly'; // Display error if valid returns false
			}
		};




	})

	// Custom directive to check matching passwords	
	.directive('match', function() {
		return {
			restrict: 'A', // Restrict to HTML Attribute
			controller: function($scope) {
				$scope.confirmed = false; // Set matching password to false by default

				// Custom function that checks both inputs against each other				
				$scope.doConfirm = function(values) {
					// Run as a loop to continue check for each value each time key is pressed
					values.forEach(function(ele) {
						// Check if inputs match and set variable in $scope
						if ($scope.confirm == ele) {
							$scope.confirmed = true; // If inputs match
						} else {
							$scope.confirmed = false; // If inputs do not match
						}
					});
				}
			},

			link: function(scope, element, attrs) {

				// Grab the attribute and observe it			
				attrs.$observe('match', function() {
					scope.matches = JSON.parse(attrs.match); // Parse to JSON
					scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other	
				});

				// Grab confirm ng-model and watch it			
				scope.$watch('confirm', function() {
					scope.matches = JSON.parse(attrs.match); // Parse to JSON
					scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other	
				});
			}
		};
	})

	// Controller: facebookCtrl is used finalize facebook login
	.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {

		var app = this;
		app.errorMsg = false; // Clear errorMsg on page load
		app.expired = false; // Clear expired on page load
		app.disabled = true; // On page load, remove disable lock from form

		// Check if callback was successful 
		if ($window.location.pathname == '/facebookerror') {
			app.errorMsg = 'Facebook e-mail not found in database.'; // If error, display custom message
		} else if ($window.location.pathname == '/facebook/inactive/error') {
			app.expired = true; // Variable to activate "Resend Link Button"
			app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
		} else {
			Auth.facebook($routeParams.token); // If no error, set the token
			$location.path('/'); // Redirect to home page
		}
	})

	// Controller: twitterCtrl is used finalize facebook login	
	.controller('twitterCtrl', function($routeParams, Auth, $location, $window) {

		var app = this;
		app.errorMsg = false; // Clear errorMsg on page load
		app.expired = false; // Clear expired on page load
		app.disabled = true; // On page load, remove disable lock from form

		// Check if callback was successful 		
		if ($window.location.pathname == '/twittererror') {
			app.errorMsg = 'Twitter e-mail not found in database.'; // If error, display custom message
		} else if ($window.location.pathname == '/twitter/inactive/error') {
			app.expired = true; // Variable to activate "Resend Link Button"
			app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
		} else {
			Auth.facebook($routeParams.token); // If no error, set the token
			$location.path('/'); // Redirect to home page
		}
	})

	// Controller: googleCtrl is used finalize facebook login	
	.controller('googleCtrl', function($routeParams, Auth, $location, $window) {

		var app = this;
		app.errorMsg = false; // Clear errorMsg on page load
		app.expired = false; // Clear expired on page load
		app.disabled = true; // On page load, remove disable lock from form

		// Check if callback was successful 		
		if ($window.location.pathname == '/googleerror') {
			app.errorMsg = 'Google e-mail not found in database.'; // If error, display custom message
		} else if ($window.location.pathname == '/google/inactive/error') {
			app.expired = true; // Variable to activate "Resend Link Button"
			app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
		} else {
			Auth.facebook($routeParams.token); // If no error, set the token
			$location.path('/'); // Redirect to home page
		}
	});