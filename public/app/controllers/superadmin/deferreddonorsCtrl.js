angular.module('deferreddonorsControllers', [])

// Controller: User to control the management page and managing of user accounts
.controller('deferreddonorsCtrl', function(Blooddonation,$scope) {
    var app = this;
    app.loading = true; // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
    app.phase1 = true; // Set the 'name' tab to default view


    function getDeferredDonors() {
        // Runs function to get all the users from database
        Blooddonation.getDeferred().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                app.blooddonations = data.data.blooddonations; // Assign users from database to variable       
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

   

    


    getDeferredDonors();

    app.updateWaiting = function(_id) {
        // Run function to delete a user
        Blooddonation.updateWaiting(_id).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getBlooddonations(); // Reset users on page
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

          // Function: Set the name pill to active
          app.namePhase = function() {
            $scope.nameTab = 'active'; // Set name list to active
            $scope.usernameTab = 'default'; // Clear username class
            $scope.emailTab = 'default'; // Clear email class
            $scope.permissionsTab = 'default'; // Clear permission class
            app.phase1 = true; // Set name tab active
            app.phase2 = false; // Set username tab inactive
            app.phase3 = false; // Set e-mail tab inactive
            app.phase4 = false; // Set permission tab inactive
            app.errorMsg = false; // Clear error message
        };  app.namePhase = function() {
            $scope.nameTab = 'active'; // Set name list to active
            $scope.usernameTab = 'default'; // Clear username class
            $scope.emailTab = 'default'; // Clear email class
            $scope.permissionsTab = 'default'; // Clear permission class
            app.phase1 = true; // Set name tab active
            app.phase2 = false; // Set username tab inactive
            app.phase3 = false; // Set e-mail tab inactive
            app.phase4 = false; // Set permission tab inactive
            app.errorMsg = false; // Clear error message
        };
      
   
       

    })
    .controller('editblooddonationCtrl', function($scope, $routeParams, Blooddonation, $timeout) {
        var app = this;
        $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
        app.phase1 = true; // Set the 'name' tab to default view
    
        // Function: get the user that needs to be edited
        Blooddonation.getBlooddonation($routeParams.id).then(function(data) {
            // Check if the user's _id was found in database
            if (data.data.success) {
                
                $scope.newEmail = data.data.blooddonation.person_claimed; // Display user's e-mail in scope
                $scope.newReceipt = data.data.blooddonation.receipt_no; // Display user's e-mail in scope
                app.currentUser = data.data.blooddonation._id; // Get user's _id for update functions
            } else {
                app.errorMsg = data.data.message; // Set error message
            }
        });
      // Function: Update the user's e-mail
      app.updateReceipt = function(newReceipt, valid) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Lock form while processing
        // Check if submitted e-mail is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass in function
            userObject._id = app.currentUser; // Get the user's _id in order to edit
            userObject.receipt_no = $scope.newReceipt; // Pass the new e-mail to save to user in database
            // Run function to update the user's e-mail
            Blooddonation.editBlooddonation(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.emailForm.receipt_no.$setPristine(); // Reset e-mail form
                        app.emailForm.receipt_no.$setUntouched(); // Reset e-mail form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

        // Function: Update the user's e-mail
        app.updateEmail = function(newEmail, valid) {
            app.errorMsg = false; // Clear any error messages
            app.disabled = true; // Lock form while processing
            // Check if submitted e-mail is valid
            if (valid) {
                var userObject = {}; // Create the user object to pass in function
                userObject._id = app.currentUser; // Get the user's _id in order to edit
                userObject.person_claimed = $scope.newEmail; // Pass the new e-mail to save to user in database
                // Run function to update the user's e-mail
                Blooddonation.editBlooddonation(userObject).then(function(data) {
                    // Check if able to edit user
                    if (data.data.success) {
                        app.successMsg = data.data.message; // Set success message
                        // Function: After two seconds, clear and re-enable
                        $timeout(function() {
                            app.emailForm.person_claimed.$setPristine(); // Reset e-mail form
                            app.emailForm.person_claimed.$setUntouched(); // Reset e-mail form
                            app.successMsg = false; // Clear success message
                            app.disabled = false; // Enable form for editing
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message; // Set error message
                        app.disabled = false; // Enable form for editing
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
                app.disabled = false; // Enable form for editing
            }
        };
    


    });

