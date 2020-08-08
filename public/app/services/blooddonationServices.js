angular.module('blooddonationServices', [])

	.factory('Blooddonation', function($http) {
		var blooddonationFactory = {}; // Create the Bloodrequest object

			blooddonationFactory.getPermission = function() {
				return $http.get('/api/permission/');
			};
			// Get all the users from database
			blooddonationFactory.getChart1 = function() {
				return $http.get('/api/blooddonationarea/');
			}

			// Get all the users from database
			blooddonationFactory.getChartclaimed = function() {
				return $http.get('/api/blooddonationareaclaimed/');
			}
			
			// Get all the users from database
			blooddonationFactory.getChart2 = function() {
				return $http.get('/api/blooddonationpie/');
			}
			
			  // Get all the users from database
			blooddonationFactory.getChart3 = function() {
				return $http.get('/api/blooddonationsimplepie/');
			}
			
			  // Get all the users from database
			  blooddonationFactory.getChart4 = function() {
				return $http.get('/api/blooddonationareapasay/');
			}
	
			  // Get all the users from database
			  blooddonationFactory.getChart5 = function() {
				return $http.get('/api/blooddonationareamandaluyong/');
			}
	
			  // Get all the users from database
			  blooddonationFactory.getChart6 = function() {
				return $http.get('/api/blooddonationarearizal/');
			}

				// Get all the users from database
				blooddonationFactory.getChart7 = function() {
				return $http.get('/api/blooddonationareacaloocan/');
			}

			// Get all the users from database
			blooddonationFactory.getChart8 = function() {
				return $http.get('/api/blooddonationareamanila/');
			}

			// Get all the users from database
			blooddonationFactory.getChart9 = function() {
				return $http.get('/api/blooddonationareaquezon/');
			}
		
			
		// Bloodrequest.create(regData)
		blooddonationFactory.create = function(regData) {
			return $http.post('/api/blooddonations', regData); // Return data from end point to controller
		};
	

		blooddonationFactory.createthis = function(regDeferral) {
			return $http.post('/api/blood_deferral', regDeferral); // Return data from end point to controller
		};

		// Get the current Bloodrequest's permission
		blooddonationFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
	

		// Get all the users from database
		blooddonationFactory.getUsers = function() {
			return $http.get('/api/blooddonationmanagement/');
		};

		

		// Get all the users from database
		blooddonationFactory.getDeferred = function() {
			return $http.get('/api/blooddonationdeferred/');
		};


	
	//// Edit a Bloodrequest
		blooddonationFactory.editBlooddonation = function(id) {
			return $http.put('/api/editblooddonation', id);
		};

		// Get user to then edit
		blooddonationFactory.getBlooddonation = function(id) {
			return $http.get('/api/editblooddonation/' + id);
		};

		
		return blooddonationFactory;
	});
