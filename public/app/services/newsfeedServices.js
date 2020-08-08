angular.module('newsfeedServices', [])

	.factory('Newsfeed', function($http) {
		var newsfeedFactory = {}; // Create the newsfeed object

		// newsfeed.create(regData)
		newsfeedFactory.create = function(regData) {
			return $http.post('/api/newsfeeds', regData); // Return data from end point to controller
		};

		// Get the current Newsfeed's permission
		newsfeedFactory.getPermission = function() {
			return $http.get('/api/permission/');
		};
	
		// Get all the Newsfeeds from database
		newsfeedFactory.getNewsfeeds = function() {
			return $http.get('/api/newsfeedmanagement/');
		};
	
		// Get Newsfeed to then edit
		newsfeedFactory.getNewsfeed = function(id) {
			return $http.get('/api/edit/' + id);
		};
	
		// Delete a Newsfeed
		newsfeedFactory.deleteNewsfeed = function(Newsfeedname) {
			return $http.delete('/api/newsfeedmanagement/' + Newsfeedname);
		};
	
		// Edit a Newsfeed
		newsfeedFactory.editNewsfeed = function(id) {
			return $http.put('/api/edit', id);
		};

		return newsfeedFactory;
	});
