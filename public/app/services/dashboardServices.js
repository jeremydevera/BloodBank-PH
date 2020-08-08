angular.module('dashboardServices', [])

	.factory('', function($http) {
		var blooddonationFactory = {}; // Create the Bloodrequest object
		// Get the current Bloodrequest's permission
		blooddonationFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
		// Get all the users from database
		blooddonationFactory.getChart = function() {
			return $http.get('/api/blooddonationarea/');
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
			return $http.get('/api/blooddonationarea/');
		}

		  // Get all the users from database
		  blooddonationFactory.getChart5 = function() {
			return $http.get('/api/blooddonationareamandaluyong/');
		}

		  // Get all the users from database
		  blooddonationFactory.getChart6 = function() {
			return $http.get('/api/blooddonationareapasig/');
		}
		
		
		
		
		return blooddonationFactory;
	});
