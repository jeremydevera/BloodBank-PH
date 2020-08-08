angular.module('bloodbankchapterServices', [])

	.factory('Bloodbankchapter', function($http) {
		var bloodrequestFactory = {}; // Create the Bloodrequest object

	
		// Get the current Bloodrequest's permission
		bloodrequestFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
	
		// Get all the Bloodrequests from database
		bloodrequestFactory.getBloodbankchapters = function() {
			return $http.get('/api/bloodbankchapters/');
		};


		// Get Bloodrequest to then edit
		bloodrequestFactory.getBloodrequest = function(id) {
			return $http.get('/api/edit/' + id);
		};
	
		// Delete a Bloodrequest
		bloodrequestFactory.deleteBloodrequest = function(Bloodrequestname) {
			return $http.delete('/api/bloodrequestmanagement/' + Bloodrequestname);
		};
	
		// Edit a Bloodrequest
		bloodrequestFactory.editBloodrequest = function(id) {
			return $http.put('/api/edit', id);
		};

		return bloodrequestFactory;
	});
