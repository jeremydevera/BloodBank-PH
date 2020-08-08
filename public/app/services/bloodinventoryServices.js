angular.module('bloodinventoryServices', [])

	.factory('Bloodinventory', function($http) {
		var bloodinventoryFactory = {}; // Create the Bloodrequest object

		// Bloodrequest.create(regData)
		bloodinventoryFactory.create = function(regData) {
			return $http.post('/api/bloodrequests', regData); // Return data from end point to controller
		};

		// Get the current Bloodrequest's permission
		bloodinventoryFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
	

		// Get all the users from database
		bloodinventoryFactory.getUsers = function() {
			return $http.get('/api/bloodinventorymanagement/');
		};

	    // Edit a Bloodrequest
		bloodinventoryFactory.editBloodrequest = function(id) {
			return $http.put('/api/editbloodrequest', id);
		};

		// Get user to then edit
		bloodinventoryFactory.getBloodrequest = function(id) {
			return $http.get('/api/editbloodrequest/' + id);
		}


		
		return bloodinventoryFactory;
	});
