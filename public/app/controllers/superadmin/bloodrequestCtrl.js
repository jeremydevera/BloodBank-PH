angular.module('bloodrequestControllers', [])

// Controller: User to control the management page and managing of user accounts
.controller('bloodrequestCtrl', function(Bloodrequest,$scope) {
    var app = this;
    app.loading = true; // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
    app.phase1 = true; // Set the 'name' tab to default view


    function getBloodrequests() {
        // Runs function to get all the users from database
        Bloodrequest.getUsers().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
            app.bloodrequests = data.data.bloodrequests; // Assign users from database to variable
          
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getBloodrequestsapproved() {
        
        Bloodrequest.getApproved().then(function(data) {
           
            if (data.data.success) {
                app.bloodrequestsapproved = data.data.bloodrequests; // Assign users from database to variable 
              
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getBloodrequestsclaimed() {
        // Runs function to get all the users from database
        Bloodrequest.getClaimed().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
  
            app.bloodrequestsclaimed = data.data.bloodrequests; // Assign users from database to variable
    
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getBloodrequestsdeclined() {
        // Runs function to get all the users from database
        Bloodrequest.getDeclined().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                app.bloodrequestsdeclined = data.data.bloodrequests; // Assign users from database to variable
                                   
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }


    getBloodrequests();
    getBloodrequestsapproved();
    getBloodrequestsclaimed();
    getBloodrequestsdeclined();

    app.updateClaim = function(_id) {
        // Run function to delete a user
        Bloodrequest.updateClaim(_id).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getBloodrequests(); // Reset users on page
                getBloodrequestsapproved();
                getBloodrequestsclaimed();
                getBloodrequestsdeclined();
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    app.updateApprove = function(_id) {
        // Run function to delete a user
        Bloodrequest.updateApprove(_id).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getBloodrequests(); // Reset users on page
                getBloodrequestsapproved();
                getBloodrequestsclaimed();
                getBloodrequestsdeclined();
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    app.updateDecline = function(_id) {
        // Run function to delete a user
        Bloodrequest.updateDecline(_id).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getBloodrequests(); // Reset users on page
                getBloodrequestsapproved();
                getBloodrequestsclaimed();
                getBloodrequestsdeclined();
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    app.updateWaiting = function(_id) {
        // Run function to delete a user
        Bloodrequest.updateWaiting(_id).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getBloodrequests(); // Reset users on page
                getBloodrequestsapproved();
                getBloodrequestsclaimed();
                getBloodrequestsdeclined();
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
      
        ////////////////////////////////SHOW APPROVED/////////////////////////////////////////
        // Function: Set the username pill to active
    app.usernamePhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'active'; // Set username list to active
        $scope.emailTab = 'default'; // CLear e-mail class
        $scope.permissionsTab = 'default'; // CLear permissions tab
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = true; // Set username tab to active
        app.phase3 = false; // Set e-mail tab to inactive
        app.phase4 = false; // Set permission tab to inactive
        app.errorMsg = false; // CLear error message
    };
           // Function: Set the e-mail pill to active
    app.emailPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'active'; // Set e-mail list to active
        $scope.permissionsTab = 'default'; // Clear permissions class
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = false; // Set username tab to inactive
        app.phase3 = true; // Set e-mail tab to active
        app.phase4 = false; // Set permission tab to inactive
        app.errorMsg = false; // Clear error message
    };

    app.permissionsPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'default'; // Clear e-mail class
        $scope.permissionsTab = 'active'; // Set permission list to active
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = false; // Set username to inactive
        app.phase3 = false; // Set e-mail tab to inactive
        app.phase4 = true; // Set permission tab to active
        app.disableUser = false; // Disable buttons while processing
        app.disableModerator = false; // Disable buttons while processing
        app.disableAdmin = false; // Disable buttons while processing
        app.errorMsg = false; // Clear any error messages
        // Check which permission was set and disable that button
      
    };
       

    })
    .controller('editbloodrequestCtrl', function($scope, $routeParams, Bloodrequest, $timeout) {
        var app = this;
        $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
        app.phase1 = true; // Set the 'name' tab to default view
    
        // Function: get the user that needs to be edited
        Bloodrequest.getBloodrequest($routeParams.id).then(function(data) {
            // Check if the user's _id was found in database
            if (data.data.success) {
                
                $scope.newEmail = data.data.bloodrequest.person_claimed; // Display user's e-mail in scope
                $scope.newReceipt = data.data.bloodrequest.receipt_no; // Display user's e-mail in scope
                app.currentUser = data.data.bloodrequest._id; // Get user's _id for update functions
            } else {
                app.errorMsg = data.data.message; // Set error message
            }
        });
    
      app.updateReceipt = function(newReceipt, valid) {
        app.errorMsg = false; 
        app.disabled = true; 

        if (valid) {
            var userObject = {}; 
            userObject._id = app.currentUser; 
            userObject.receipt_no = $scope.newReceipt; 
            Bloodrequest.editBloodrequest(userObject).then(function(data) {
          
                if (data.data.success) {
                    app.successMsg = data.data.message; 
                    $timeout(function() {
                        app.emailForm.receipt_no.$setPristine(); 
                        app.emailForm.receipt_no.$setUntouched(); 
                        app.successMsg = false; 
                        app.disabled = false; 
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false; 
                }
            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly';
            app.disabled = false; 
        }
    };

      
        app.updateEmail = function(newEmail, valid) {
            app.errorMsg = false;
            app.disabled = true; 
            if (valid) {
                var userObject = {}; 
                userObject._id = app.currentUser;
                userObject.person_claimed = $scope.newEmail;
                Bloodrequest.editBloodrequest(userObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.emailForm.person_claimed.$setPristine(); 
                            app.emailForm.person_claimed.$setUntouched(); 
                            app.successMsg = false; 
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message; 
                        app.disabled = false; 
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly'; 
                app.disabled = false; 
            }
        };
    


    })

    .controller('editremarkCtrl', function($scope, $routeParams, Bloodrequest, $timeout) {
        var app = this;
        $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
  
    
        // Function: get the user that needs to be edited
        Bloodrequest.getRemark($routeParams.id).then(function(data) {
            // Check if the user's _id was found in database
            if (data.data.success) {
                
                $scope.newRemark = data.data.bloodrequest.remarks; // Display user's e-mail in scope
                app.currentUser = data.data.bloodrequest._id; // Get user's _id for update functions
            } else {
                app.errorMsg = data.data.message; // Set error message
            }
        });
      

        // Function: Update the user's e-mail
        app.updateRemark = function(newRemark, valid) {
            app.errorMsg = false; // Clear any error messages
            app.disabled = true; // Lock form while processing
            // Check if submitted e-mail is valid
            if (valid) {
                var userObject = {}; // Create the user object to pass in function
                userObject._id = app.currentUser; // Get the user's _id in order to edit
                userObject.remarks = $scope.newRemark; // Pass the new e-mail to save to user in database
                // Run function to update the user's e-mail
                Bloodrequest.editRemark(userObject).then(function(data) {
                    // Check if able to edit user
                    if (data.data.success) {
                        app.successMsg = data.data.message; // Set success message
                        // Function: After two seconds, clear and re-enable
                        $timeout(function() {
                            app.remarkForm.remarks.$setPristine(); // Reset e-mail form
                            app.remarkForm.remarks.$setUntouched(); // Reset e-mail form
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
    })
    
    
    .controller('editapprovedCtrl', function($scope, $routeParams, Bloodrequest, $timeout) {
        var app = this;
        $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
  
    
        // Function: get the user that needs to be edited
        Bloodrequest.getRemarkapproved($routeParams.id).then(function(data) {
            // Check if the user's _id was found in database
            if (data.data.success) {
                
                $scope.newRemarkapproved = data.data.bloodrequest.remarksapproved; // Display user's e-mail in scope
                app.currentUser = data.data.bloodrequest._id; // Get user's _id for update functions
            } else {
                app.errorMsg = data.data.message; // Set error message
            }
        });
      

      
        app.updateRemarkapproved = function(newRemark, valid) {
            app.errorMsg = false; 
            app.disabled = true; 
          
            if (valid) {
                var userObject = {}; 
                userObject._id = app.currentUser; 
                userObject.remarksapproved = $scope.newRemarkapproved; 
         
                Bloodrequest.editRemarkapproved(userObject).then(function(data) {
                 
                    if (data.data.success) {
                        app.successMsg = data.data.message; 
                      
                        $timeout(function() {
                            app.remarkFormapproved.remarksapproved.$setPristine(); 
                            app.remarkFormapproved.remarksapproved.$setUntouched(); 
                            app.successMsg = false; 
                            app.disabled = false; 
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message; 
                        app.disabled = false; 
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly'; 
                app.disabled = false; 
            }
        };
    })
    
    ;

