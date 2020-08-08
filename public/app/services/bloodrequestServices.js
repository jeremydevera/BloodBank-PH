angular.module('bloodrequestServices', [])

	.factory('Bloodrequest', function($http) {
		var bloodrequestFactory = {}; // Create the Bloodrequest object

		// Bloodrequest.create(regData)
		bloodrequestFactory.create = function(regData) {
			return $http.post('/api/bloodrequests', regData); // Return data from end point to controller
		};

		// Get the current Bloodrequest's permission
		bloodrequestFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
	

		// Get all the users from database
		bloodrequestFactory.getUsers = function() {
			return $http.get('/api/bloodrequestmanagementwaiting/');
		};

		// Get all the users from database
		bloodrequestFactory.getApproved = function() {
			return $http.get('/api/bloodrequestmanagementapproved/');
		};

		// Get all the users from database
		bloodrequestFactory.getClaimed = function() {
			return $http.get('/api/bloodrequestmanagementclaimed/');
		};

		// Get all the users from database
		bloodrequestFactory.getDeclined = function() {
			return $http.get('/api/bloodrequestmanagementdeclined/');
		};

		// update claim
		bloodrequestFactory.updateClaim = function(_id) {
			return $http.put('/api/bloodrequestclaim/' + _id);
		};

		// Delete a user
		bloodrequestFactory.updateApprove = function(_id) {
			return $http.put('/api/bloodrequestapprove/' + _id);
		};

		// Delete a user
		bloodrequestFactory.updateDecline = function(_id) {
			return $http.put('/api/bloodrequestdecline/' + _id);
		};

		// Delete a user
		bloodrequestFactory.updateWaiting = function(_id) {
			return $http.put('/api/bloodrequestwaiting/' + _id);
		};
	
	    // Edit a Bloodrequest
		bloodrequestFactory.editBloodrequest = function(id) {
			return $http.put('/api/editbloodrequest', id);
		};

		// Get user to then edit
		bloodrequestFactory.getBloodrequest = function(id) {
			return $http.get('/api/editbloodrequest/' + id);
		};

		// Edit a Bloodrequest
		bloodrequestFactory.editRemark = function(id) {
			return $http.put('/api/editremark', id);
		};

		// Get user to then edit
		bloodrequestFactory.getRemark = function(id) {
			return $http.get('/api/editremark/' + id);
		};


		// Edit a Bloodrequest
		bloodrequestFactory.editRemarkapproved = function(id) {
			return $http.put('/api/editremarkapproved', id);
		};

		// Get user to then edit
		bloodrequestFactory.getRemarkapproved = function(id) {
			return $http.get('/api/editremarkapproved/' + id);
		};
		

		// Get all the users from database
		bloodrequestFactory.getChartclaimed = function() {
			return $http.get('/api/blooddonationareaclaimed/');
		}
				
		return bloodrequestFactory;
	});
