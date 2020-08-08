angular.module('bloodnoticeServices', [])

	.factory('Bloodnotice', function($http) {
		var bloodnoticeFactory = {}; // Create the newsfeed object

		// newsfeed.create(regData)
		bloodnoticeFactory.create = function(regData) {
			return $http.post('/api/bloodnotices', regData); // Return data from end point to controller
		};

		// Get the current Newsfeed's permission
		bloodnoticeFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
	
		// Get all the Newsfeeds from database
		bloodnoticeFactory.getNewsfeeds = function() {
			return $http.get('/api/newsfeedmanagement/');
		};
	
		// Get Newsfeed to then edit
		bloodnoticeFactory.getNewsfeed = function(id) {
			return $http.get('/api/edit/' + id);
		};
	
		// Delete a Newsfeed
		bloodnoticeFactory.deleteNewsfeed = function(Newsfeedname) {
			return $http.delete('/api/newsfeedmanagement/' + Newsfeedname);
		};
	
		// Edit a Newsfeed
		bloodnoticeFactory.editNewsfeed = function(id) {
			return $http.put('/api/edit', id);
		};

		return bloodnoticeFactory;
	});
