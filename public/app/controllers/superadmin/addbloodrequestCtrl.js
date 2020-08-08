angular.module('addbloodrequestControllers', ['bloodrequestServices'])

    .controller('addbloodrequestCtrl', function($http, $location, $timeout, Bloodrequest, $route) {

        var app = this;

        // Function to submit form and register account
        app.regBloodrequest = function(regData) {
            app.loading = true; // To activate spinning loading icon w/bootstrap
            app.errorMsg = false; // Clear error message each time the newsfeed presses submit

            // Initiate service to save the newsfeed into the dabase            
            Bloodrequest.create(app.regData).then(function(data) {
                if (data.data.success) {
                    app.loading = false; // Once data is retrieved, loading icon should be cleared
                    app.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    // Redirect to home page after 2000 miliseconds
                    $timeout(function() {
                        $location.path('/');
                        $route.reload();
                    }, 2000);
                } else {
                    app.loading = false; // Once data is retrieved, loading icon should be cleared
                    app.errorMsg = data.data.message; // Create an error message
                }
            });
        };
    });