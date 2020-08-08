angular.module('newsfeedmanageController', [])

// Controller: User to control the management page and managing of user accounts
.controller('newsfeedmanageCtrl', function(Newsfeed) {
    var app = this;
    app.loading = true; // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    // Function: get all the Newsfeeds from database
        // Runs function to get all the Newsfeeds from database
        Newsfeed.getNewsfeeds().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                    app.newsfeeds = data.data.newsfeeds; // Assign users from database to variable                
                    app.loading = false; // Stop loading icon
                    app.accessDenied = false; // Show table
                    // Check if logged in user is an admin or moderator
         
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    });

