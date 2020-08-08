var User = require('../models/user'); // Import User Model
var Newsfeed = require('../models/newsfeed'); // Important the database User Model created with Mongoose Schema
var Bloodrequest = require('../models/bloodrequest'); 
var Blooddonation = require('../models/blooddonation'); 
var Bloodinventory = require('../models/bloodinventory'); 
var Bloodbankchapter = require('../models/bloodbankchapter'); 
var Bloodnotice = require('../models/bloodnotice'); 
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package

const express = require('express');
const router = express.Router();

var session = require('express-session');

module.exports = function(router,io) {
    router.use(session({secret: 'ssshhhhh'}));
    // Start Sendgrid Configuration Settings    
    var options = {
        auth: {
            api_user: 'jade0903', // Sendgrid username
            api_key: 'password123' // Sendgrid password
        }
    };
    var client = nodemailer.createTransport(sgTransport(options));
    // End Sendgrid Configuration Settings  

    var sess;
    router.get('/',function(req,res){
        sess=req.session;

        //sess.email; // equivalent to $_SESSION['email'] in PHP.
        sess.userid; // equivalent to $_SESSION['username'] in PHP.
        sess.branch;
        sess.name;
        sess.lastname;
    });

     // Route for user logins
     router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password active branch name lastname').exec(function(err, user) {
            if (err) throw err; // Throw err if cannot connect

            // Check if user is found in the database (based on username)           
            if (!user) {
                res.json({ success: false, message: 'Username not found' }); // Username not found in database
            } else if (user) {
                // Check if user does exist, then compare password provided by user
                if (!req.body.password) {
                    res.json({ success: false, message: 'No password provided' }); // Password was not provided
                } else {
                    var validPassword = user.comparePassword(req.body.password); // Check if password matches password provided by user 
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password in database
                    } else if (!user.active) {
                        res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true }); // Account is not activated 
                    } else {
                        sess=req.session;
                        sess.userid = user._id;
                        sess.branch = user.branch;
                        sess.name = user.name;
                        
                        console.log("user_id " + user._id);
                        console.log("userid: " + sess.userid);
                        console.log("name: " + sess.name);
                        var token = jwt.sign({ username: user.username, email: user.email, branch:user.branch, name:user.name, lastname:user.lastname }, secret, { expiresIn: '24h' }); // Logged in: Give user token
                        res.json({ success: true, message: 'User authenticated!', token: token }); // Return token in JSON object to controller
                    }
                }
            }
        });
    });

    // Route to register new users  
    router.post('/users', function(req, res) {
        var user = new User(); // Create new User object
        user.user_firstname = req.body.user_firstname; 
        user.user_lastname = req.body.user_lastname; 
        user.user_middlename = req.body.user_middlename; 
        user.username = req.body.username;
        user.password = req.body.password; // Save password from request to User object
        user.email = req.body.email; // Save email from request to User object
        user.user_contactNum = req.body.user_contactNum;
        user.branch = req.body.branch; // Save name from request to User object
        user.temporarytoken = jwt.sign({ email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
        // Check if request is valid and not empty or null
        if (req.body.password === null || req.body.password === '' 
        || req.body.email === null || req.body.email === '' || req.body.user_firstname === null 
        || req.body.user_firstname === '' || req.body.user_lastname === null || req.body.user_lastname === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // Save new user to database
            user.save(function(err) {
               
                    // Check if any validation errors exists (from user model)
                   if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    
                } else {
                    // Create e-mail object to send to user
                    var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.email,
                        subject: 'Localhost Activation Link',
                        text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
                    };
                    // Function to send e-mail to the user
                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                    });
                    res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' }); // Send success message back to controller/request
                }
            });
        }
    });

    router.post('/newsfeeds', function(req, res) {
        var date = new Date();
        var newsfeed = new Newsfeed(); // Create a new User object and save to a variable
        newsfeed.permission = req.body.permission; // Save username sent by request (using bodyParser)
        newsfeed.subject = req.body.subject; // Save username sent by request (using bodyParser)
        newsfeed.user_id =  sess.branch; // Save password sent by request (using bodyParser)
        newsfeed.nw_content = req.body.nw_content; // Save email sent by request (using bodyParser)
        newsfeed.posted_by = sess.name;
        newsfeed.date_posted = date.toGMTString();
        
        // If statement to ensure request it not empty or null
        if (req.body.nw_content == null || req.body.nw_content == '' || req.body.subject == null || req.body.subject == '') {
            res.json({ success: false, message: 'Ensure fields were provided' });
        } else {
            // If criteria is met, save user to database
            newsfeed.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Post already Exists!' }); // Cannot save if username or email exist in the database
                } else {
                console.log('newsfeed okay');
                   //websocket.sockets.emit('getnewsfeed');
                   //websocket.compress(false).emit('getnewsfeedweb');
                    io.sockets.emit('update'); // how?
                    res.json({ success: true, message: 'Announcement Posted!' }); // If all criteria met, save user
                }
            });
        }
    });

    router.post('/bloodrequests', function(req, res) {
        var bloodrequest = new Bloodrequest(); 
        var date = new Date();
        bloodrequest.permission = req.body.permission; 
        bloodrequest.patient_name = req.body.patient_name; 
        bloodrequest.blood_group = req.body.blood_group; 
        bloodrequest.blood_needed = req.body.blood_needed; 
        bloodrequest.volume = req.body.volume;
        bloodrequest.no_of_bags = req.body.no_of_bags;
        bloodrequest.date_requested = date.toGMTString();
        bloodrequest.date_claimed = date.toGMTString();
        bloodrequest.branch = sess.branch;
        bloodrequest.request_status = 'claimed';
        bloodrequest.person_claimed = req.body.person_claimed;
        bloodrequest.receipt_no = req.body.receipt_no;

        // If statement to ensure request it not empty or null
        if (req.body.patient_name == null || req.body.patient_name == '' || req.body.blood_group == null || req.body.blood_group == '') {
            res.json({ success: false, message: 'Ensure the fields are provided' });
        } else {
            // If criteria is met, save user to database
            bloodrequest.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                } else {
                    res.json({ success: true, message: 'user created!' }); // If all criteria met, save user
                }
            });
        }
    });

    router.post('/blooddonations', function(req, res) {
        var blooddonation = new Blooddonation(); 
        sess=req.session;




        blooddonation.donation_no = req.body.donation_no; 
        blooddonation.donors_name = req.body.donors_name; 
        blooddonation.date = req.body.date; 
        blooddonation.time = req.body.time;
        blooddonation.blood_group = req.body.blood_group; 
        blooddonation.volume = req.body.volume;
        blooddonation.no_of_bags_donated = req.body.no_of_bags_donated;
        blooddonation.blood_product_donated = req.body.blood_product_donated;
        blooddonation.branch = sess.branch;
        // If statement to ensure request it not empty or null
        if (req.body.donation_no == null || req.body.donation_no == '' || req.body.donors_name == null || req.body.donors_name == '' || req.body.date == null || req.body.date == '') {
            res.json({ success: false, message: 'Ensure the fields are provided' });
        } else {
            // If criteria is met, save user to database
            blooddonation.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Blood Donation already exists!' }); // Cannot save if username or email exist in the database
                } else {
                    res.json({ success: true, message: 'Blood Donation Created!' }); // If all criteria met, save user
                }
            });
        }
    });

    router.post('/blood_deferral', function(req, res) {
        var blooddonation = new Blooddonation(); 
        sess=req.session;

        blooddonation.donation_no = req.body.donation_no; 
        blooddonation.donors_name = req.body.donors_name; 
        blooddonation.deferral_date = req.body.deferral_date; 
        blooddonation.deferral_type = req.body.deferral_type;
        blooddonation.branch = sess.branch;
    
        // If statement to ensure request it not empty or null
        if (req.body.donation_no == null) {
            res.json({ success: false, message: 'Ensure the fields are provided' });
        } else {
            // If criteria is met, save user to database
            blooddonation.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Deferral Already Exists!' }); // Cannot save if username or email exist in the database
                } else {
                    res.json({ success: true, message: 'Deferral Added' }); // If all criteria met, save user
                }
            });
        }
    });


    router.post('/bloodnotices', function(req, res) {
        var bloodnotice = new Bloodnotice(); 
        sess=req.session;

        bloodnotice.serial_code = req.body.serial_code; 
        bloodnotice.message = req.body.message; 
        bloodnotice.branch = sess.branch;
    
        // If statement to ensure request it not empty or null
        if (req.body.serial_code == null) {
            res.json({ success: false, message: 'Ensure the fields are provided' });
        } else {
            // If criteria is met, save user to database
            bloodnotice.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Blood Test Notice Already Exists!' }); // Cannot save if username or email exist in the database
                } else {
                    res.json({ success: true, message: 'Blood Test Notice Sent!' }); // If all criteria met, save user
                }
            });
        }
    });



    
    // Route to check if username chosen on registration page is taken
    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) throw err; // Throw err if cannot connect

            if (user) {
                res.json({ success: false, message: 'That username is already taken' }); // If user is returned, then username is taken
            } else {
                res.json({ success: true, message: 'Valid username' }); // If user is not returned, then username is not taken
            }
        });
    });

    // Route to check if e-mail chosen on registration page is taken    
    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) throw err; // Throw err if cannot connect

            if (user) {
                res.json({ success: false, message: 'That e-mail is already taken' }); // If user is returned, then e-mail is taken
            } else {
                res.json({ success: true, message: 'Valid e-mail' }); // If user is not returned, then e-mail is not taken
            }
        });
    });

    // Route to activate the user's account 
    router.put('/activate/:token', function(req, res) {
        User.findOne({ temporarytoken: req.params.token }, function(err, user) {
            if (err) throw err; // Throw error if cannot login
            var token = req.params.token; // Save the token from URL for verification 

            // Function to verify the user's token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                } else {
                    user.temporarytoken = false; // Remove temporary token
                    user.active = true; // Change account status to Activated
                    // Mongoose Method to save user into the database
                    user.save(function(err) {
                        if (err) {
                            console.log(err); // If unable to save user, log error info to console/terminal
                        } else {
                            // If save succeeds, create e-mail object
                            var email = {
                                from: 'Localhost Staff, staff@localhost.com',
                                to: user.email,
                                subject: 'Localhost Account Activated',
                                text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                            };

                            // Send e-mail object to user
                            client.sendMail(email, function(err, info) {
                                if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                            });
                            res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                        }
                    });
                }
            });
        });
    });

    // Route to verify user credentials before re-sending a new activation link 
    router.post('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user) {
            if (err) throw err; // Throw error if cannot connect

            // Check if username is found in database
            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' }); // Username does not match username found in database
            } else if (user) {
                // Check if password is sent in request
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password found in database
                    } else if (user.active) {
                        res.json({ success: false, message: 'Account is already activated.' }); // Account is already activated
                    } else {
                        res.json({ success: true, user: user });
                    }
                } else {
                    res.json({ success: false, message: 'No password provided' }); // No password was provided
                }
            }
        });
    });

    // Route to send user a new activation link once credentials have been verified
    router.put('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec(function(err, user) {
            if (err) throw err; // Throw error if cannot connect
            user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give the user a new token to reset password
            // Save user's new token to the database
            user.save(function(err) {
                if (err) {
                    console.log(err); // If error saving user, log it to console/terminal
                } else {
                    // If user successfully saved to database, create e-mail object
                    var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.email,
                        subject: 'Localhost Activation Link Request',
                        text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
                    };

                    // Function to send e-mail to user
                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err); // If error in sending e-mail, log to console/terminal
                    });
                    res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); // Return success message to controller
                }
            });
        });
    });

    // Route to send user's username to e-mail
    router.get('/resetusername/:email', function(req, res) {
        User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: err }); // Error if cannot connect
            } else {
                if (!user) {
                    res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
                } else {
                    // If e-mail found in database, create e-mail object
                    var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.email,
                        subject: 'Localhost Username Request',
                        text: 'Hello ' + user.name + ', You recently requested your username. Please save it in your files: ' + user.username,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your username. Please save it in your files: ' + user.username
                    };

                    // Function to send e-mail to user
                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err); // If error in sending e-mail, log to console/terminal
                    });
                    res.json({ success: true, message: 'Username has been sent to e-mail! ' }); // Return success message once e-mail has been sent
                }
            }
        });
    });

    // Route to send reset link to the user
    router.put('/resetpassword', function(req, res) {
        console.log(req.body.username);
        User.findOne({ username: req.body.username }).select('username active email resettoken name').exec(function(err, user) {
            if (err) throw err; // Throw error if cannot connect
            if (!user) {
                res.json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
            } else if (!user.active) {
                res.json({ success: false, message: 'Account has not yet been activated' }); // Return error if account is not yet activated
            } else {
                user.resettoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
                // Save token to user in database
                user.save(function(err) {
                    if (err) {
                        res.json({ success: false, message: err }); // Return error if cannot connect
                    } else {
                        // Create e-mail object to send to user
                        var email = {
                            from: 'Localhost Staff, staff@localhost.com',
                            to: user.email,
                            subject: 'Localhost Reset Password Request',
                            text: 'Hello ' + user.name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8080/reset/' + user.resettoken,
                            html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8080/reset/' + user.resettoken + '">http://localhost:8080/reset/</a>'
                        };
                        // Function to send e-mail to the user
                        client.sendMail(email, function(err, info) {
                            if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                        });
                        res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
                        //res.sendStatus(200);
                    }
                });
            }
        });
    });

    // Route to verify user's e-mail activation link
    router.get('/resetpassword/:token', function(req, res) {
        User.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {
            if (err) throw err; // Throw err if cannot connect
            var token = req.params.token; // Save user's token from parameters to variable
            // Function to verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Password link has expired' }); // Token has expired or is invalid
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Password link has expired' }); // Token is valid but not no user has that token anymore
                    } else {
                        res.json({ success: true, user: user }); // Return user object to controller
                    }
                }
            });
        });
    });

    // Save user's new password to database
    router.put('/savepassword', function(req, res) {
        User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function(err, user) {
            if (err) throw err; // Throw error if cannot connect
            if (req.body.password === null || req.body.password === '') {
                res.json({ success: false, message: 'Password not provided' });
            } else {
                user.password = req.body.password; // Save user's new password to the user object
                user.resettoken = false; // Clear user's resettoken 
                // Save user's new data
                user.save(function(err) {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        // Create e-mail object to send to user
                        var email = {
                            from: 'Localhost Staff, staff@localhost.com',
                            to: user.email,
                            subject: 'Localhost Reset Password',
                            text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
                            html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
                        };
                        // Function to send e-mail to the user
                        client.sendMail(email, function(err, info) {
                            if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                        });
                        res.json({ success: true, message: 'Password has been reset!' }); // Return success message
                    }
                });
            }
        });
    });

    // Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']; // Check for token in body, URL, or headers

        // Check if token is valid and not expired  
        if (token) {
            // Function to verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
                } else {
                    req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                    next(); // Required to leave middleware
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
        }
    });

    // Route to get the currently logged in user    
    router.post('/me', function(req, res) {
        res.send(req.decoded); // Return the token acquired from middleware
    });

    // Route to provide the user with a new token to renew session
    router.get('/renewToken/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select('username email').exec(function(err, user) {
            if (err) throw err; // Throw error if cannot connect
            // Check if username was found in database
            if (!user) {
                res.json({ success: false, message: 'No user was found' }); // Return error
            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give user a new token
                res.json({ success: true, token: newToken }); // Return newToken in JSON object to controller
            }
        });
    });

    // Route to get the current user's permission level
    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) throw err; // Throw error if cannot connect
            // Check if username was found in database
            if (!user) {
                res.json({ success: false, message: 'No user was found' }); // Return an error
            } else {
                res.json({ success: true, permission: user.permission }); // Return the user's permission
            }
        });
    }); 

    // Route to get all users for management page
    router.get('/management', function(req, res) {
        User.find({}, function(err, users) {
            if (err) throw err; // Throw error if cannot connect
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) throw err; // Throw error if cannot connect
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if user has editing/deleting privileges 
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Check if users were retrieved from database
                        if (!users) {
                            res.json({ success: false, message: 'Users not found' }); // Return error
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission }); // Return users, along with current user's permission
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return access error
                    }
                }
            });
        });
    });


    router.get('/bloodinventorymanagement', function(req, res) {
        sess=req.session;
        console.log("userid " + sess.userid);
    
        Bloodinventory.find({},function(err, bloodinventories) {
                    
            console.log(bloodinventories.length)
            if(bloodinventories.length > 0){
                console.log(bloodinventories[0].branch)
                res.json({ success: true, bloodinventories: bloodinventories });
            }else{
                res.json({ success: false, message: 'Users not found' });
            }
        
        });
           
    });




    router.get('/blooddonationmanagement', function(req, res) {
        sess=req.session;
        console.log("userid " + sess.userid);
    
            if(sess.userid === '5c0f8eae2724181988dc2aa4'){
                    Blooddonation.find({deferral_type:'none'},function(err, blooddonations) {
                    
                        console.log(blooddonations.length)
                        if(blooddonations.length > 0){
                            console.log(blooddonations[0].donors_name)
                            res.json({ success: true, blooddonations: blooddonations });
                        }else{
                            res.json({ success: false, message: 'Users not found' });
                        }
                    
                    });
            }else{
                Blooddonation.find({$and: [ { deferral_type:'none'},{ branch: sess.branch}]},function(err, blooddonations) {
                    
                    console.log(blooddonations.length)
                    if(blooddonations.length > 0){
                        console.log(blooddonations[0].donors_name)
                        res.json({ success: true, blooddonations: blooddonations });
                    }else{
                        res.json({ success: false, message: 'Users not found' });
                    }
                
                });
            }
    });

    router.get('/blooddonationarea', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date: date });
        //console.log(date);
        });  
            
    });

    router.get('/blooddonationareaclaimed', function(req, res) {
        sess=req.session;
        Bloodrequest.aggregate([{ $match: { request_status: { $eq: 'claimed' } } },{$group: {_id : "$date_needed" , count2 :{$sum:1}}},{$sort: {_id: 1}}],function(err, date2) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date2: date2 });
        console.log(date2);
        });  
            
    });

    router.get('/blooddonationareamandaluyong', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } },{$group: {_id : "$date" , count2 :{$sum:1}}},{$sort: {_id: 1}}],function(err, date2) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date2: date2 });
        //console.log(date2);
        });  
            
    });

    router.get('/blooddonationarearizal', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{ $match: { branch: { $eq: 'Rizal' } } },{$group: {_id : "$date" , count3 :{$sum:1}}},{$sort: {_id: 1}}],function(err, date3) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date3: date3 });
        //console.log(date3);
        });  
            
    });

    router.get('/blooddonationareapasay', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{ $match: { branch: { $eq: 'Pasay' } } },{$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date: date });
        //console.log(date3);
        });  
            
    });

    router.get('/blooddonationareacaloocan', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{ $match: { branch: { $eq: 'Caloocan' } } },{$group: {_id : "$date" , count4 :{$sum:1}}},{$sort: {_id: 1}}],function(err, date4) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date4: date4 });
        //console.log(date3);
        });  
            
    });

    router.get('/blooddonationareamanila', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{ $match: { branch: { $eq: 'Manila' } } },{$group: {_id : "$date" , count5 :{$sum:1}}},{$sort: {_id: 1}}],function(err, date5) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date5: date5 });
        //console.log(date3);
        });  
            
    });

    router.get('/blooddonationareaquezon', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{ $match: { branch: { $eq: 'Quezon' } } },{$group: {_id : "$date" , count6 :{$sum:1}}},{$sort: {_id: 1}}],function(err, date6) {   
        //Blooddonation.aggregate([{ $match: { branch: { $eq: 'Mandaluyong' } } }, {$group: {_id : "$date" , count :{$sum:1}}},{$sort: {_id: 1}}],function(err, date) {     
        res.json({ success: true, date6: date6 });
        console.log(date6);
        });  
            
    });


    router.get('/blooddonationpie', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{$group: {_id : "$branch" , count :{$sum:1}}}],function(err, branch) {      
        res.json({ success: true, branch: branch });
        //console.log(branch);
        });   
    });

    router.get('/blooddonationsimplepie', function(req, res) {
        sess=req.session;
        Blooddonation.aggregate([{$group: {_id : "$deferral_type" , count :{$sum:1}}}],function(err, deferral) {      
        res.json({ success: true, deferral: deferral });
        //console.log(deferral);
        });   
    });

    



    router.get('/blooddonationdeferred', function(req, res) {
        sess=req.session;
        console.log("userid " + sess.userid);
    
            if(sess.userid === '5c0f8eae2724181988dc2aa4'){
                    Blooddonation.find({$or: [ { deferral_type: { $eq: 'Permanent' } }, { deferral_type: 'Temporary' } ] },function(err, blooddonations) {
                    
                        console.log(blooddonations.length)
                        if(blooddonations.length > 0){
                            console.log(blooddonations[0].donors_name)
                            res.json({ success: true, blooddonations: blooddonations });
                        }else{
                            res.json({ success: false, message: 'Users not found' });
                        }
                    
                    });
            }else{
                Blooddonation.find({$and: [ { $or: [ { deferral_type: { $eq: 'Permanent' } }, { deferral_type: 'Temporary' } ] },{ branch: sess.branch}]},function(err, blooddonations) {
                    //find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
                    console.log(blooddonations.length)
                    if(blooddonations.length > 0){
                        console.log(blooddonations[0].donors_name)
                        res.json({ success: true, blooddonations: blooddonations });
                    }else{
                        res.json({ success: false, message: 'Users not found' });
                    }
                
                });
            }
    });





        // Route to get all users for management page
        router.get('/newsfeedmanagement', function(req, res) {
            Newsfeed.find({}, function(err, newsfeeds) {
                if (err) throw err; // Throw error if cannot connect
                Newsfeed.findOne({ subject: req.decoded.subject }, function(err, mainUser) {
                    console.log("okayy");  
                    if (err) throw err; // Throw error if cannot connect
                    res.json({ success: true, newsfeeds: newsfeeds });  
                          
                });
            });
        });

    // Route to get all users for management page
    router.get('/bloodrequestmanagementwaiting', function(req, res) {
        sess=req.session;
        console.log("userid " + sess.userid);
        /*Bloodrequest.find({$where: function() { return (this.request_status == "") }}, function(err, bloodrequests) {
            if (err) throw err; // Throw error if cannot connect
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) throw err; // Throw error if cannot connect
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if user has editing/deleting privileges 
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Check if users were retrieved from database
                        if (!bloodrequests) {
                            res.json({ success: false, message: 'Users not found' }); // Return error
                        } else {
                            res.json({ success: true, bloodrequests: bloodrequests, permission: mainUser.permission }); // Return users, along with current user's permission
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return access error
                    }
                }
            });
        });*/
            if(sess.userid === '5c279055dc932e5d981ab0b4'){
                    Bloodrequest.find({$and: [ { request_status:'waiting'}]},function(err, bloodrequests) {
                    
                        console.log(bloodrequests.length)
                        if(bloodrequests.length > 0){
                            console.log(bloodrequests[0].patient_name)
                            res.json({ success: true, bloodrequests: bloodrequests });
                        }else{
                            res.json({ success: false, message: 'Users not found' });
                        }
                    
                });
            }else{
                Bloodrequest.find({$and: [ { request_status:'waiting'},{ branch: sess.branch}]},function(err, bloodrequests) {
                    
                    console.log(bloodrequests.length)
                    if(bloodrequests.length > 0){
                        console.log(bloodrequests[0].patient_name)
                        res.json({ success: true, bloodrequests: bloodrequests });
                    }else{
                        res.json({ success: false, message: 'Users not found' });
                    }
                
            });
        }

    });

    // Route to get all users for management page
    router.get('/bloodrequestmanagementapproved', function(req, res) {
        sess=req.session;
        console.log("userid " + sess.userid);

            if(sess.userid === '5c0f8eae2724181988dc2aa4'){
                    Bloodrequest.find({$and: [ { request_status:'approved'}]},function(err, bloodrequests) {
                    
                        console.log(bloodrequests.length)
                        if(bloodrequests.length > 0){
                            console.log(bloodrequests[0].patient_name)
                            res.json({ success: true, bloodrequests: bloodrequests });
                        }else{
                            res.json({ success: false, message: 'Users not found' });
                        }
                    
                    });
            }else{
                Bloodrequest.find({$and: [ { request_status:'approved'},{ branch: sess.branch}]},function(err, bloodrequests) {
                    
                    console.log(bloodrequests.length)
                    if(bloodrequests.length > 0){
                        console.log(bloodrequests[0].patient_name)
                        res.json({ success: true, bloodrequests: bloodrequests });
                    }else{
                        res.json({ success: false, message: 'Users not found' });
                    }
                
                });
            }
    });

 // Route to get all users for management page
 router.get('/bloodrequestmanagementclaimed', function(req, res) {
        sess=req.session;
        console.log("userid " + sess.userid);

            if(sess.userid === '5c0f8eae2724181988dc2aa4'){
                    Bloodrequest.find({$and: [ { request_status:'claimed'}]},function(err, bloodrequests) {
                    
                        console.log(bloodrequests.length)
                        if(bloodrequests.length > 0){
                            console.log(bloodrequests[0].patient_name)
                            res.json({ success: true, bloodrequests: bloodrequests });
                        }else{
                            res.json({ success: false, message: 'Users not found' });
                        }
                    
                    });
            }else{
                Bloodrequest.find({$and: [ { request_status:'claimed'},{ branch: sess.branch}]},function(err, bloodrequests) {
                    
                    console.log(bloodrequests.length)
                    if(bloodrequests.length > 0){
                        console.log(bloodrequests[0].patient_name)
                        res.json({ success: true, bloodrequests: bloodrequests });
                    }else{
                        res.json({ success: false, message: 'Users not found' });
                    }
                
                });
            }
    });

 // Route to get all users for management page
 router.get('/bloodrequestmanagementdeclined', function(req, res) {
    sess=req.session;
    console.log("userid " + sess.userid);

        if(sess.userid === '5c0f8eae2724181988dc2aa4'){
                Bloodrequest.find({$and: [ { request_status:'declined'}]},function(err, bloodrequests) {
                
                    console.log(bloodrequests.length)
                    if(bloodrequests.length > 0){
                        console.log(bloodrequests[0].patient_name)
                        res.json({ success: true, bloodrequests: bloodrequests });
                    }else{
                        res.json({ success: false, message: 'Users not found' });
                    }
                
                });
        }else{
            Bloodrequest.find({$and: [ { request_status:'declined'},{ branch: sess.branch}]},function(err, bloodrequests) {
                
                console.log(bloodrequests.length)
                if(bloodrequests.length > 0){
                    console.log(bloodrequests[0].patient_name)
                    res.json({ success: true, bloodrequests: bloodrequests });
                }else{
                    res.json({ success: false, message: 'Users not found' });
                }
            
            });
        }
});


  // Route to delete a user
  router.put('/bloodrequestclaim/:_id', function(req, res) {
    var deletedUser = req.params._id; // Assign the username from request parameters to a variable
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
        if (err) throw err; // Throw error if cannot connect
        // Check if current user was found in database
        if (!mainUser) {
            res.json({ success: false, message: 'No user found' }); // Return error
        } else {
            // Check if curent user has admin access
            if (mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
            } else {

                Bloodrequest.findOne({  _id: deletedUser }, function(err, bloodrequest) {
                    if (err) throw err; // Throw error if cannot connect
                    // Check if user is in database
                    if (!bloodrequest) {
                        res.json({ success: false, message: 'No user found' }); // Return error
                    } else {
                        bloodrequest.request_status="claimed";
                        // Save changes
                        bloodrequest.save(function(err) {
                            if (err) {
                                console.log(err); // Log any errors to the console
                            } else {
                                res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                            }
                        });
                    }
                });
            }
        }
    });
});


  // Route to delete a user
  router.put('/bloodrequestapprove/:_id', function(req, res) {
    var deletedUser = req.params._id; // Assign the username from request parameters to a variable
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
        if (err) throw err; // Throw error if cannot connect
        // Check if current user was found in database
        if (!mainUser) {
            res.json({ success: false, message: 'No user found' }); // Return error
        } else {
            // Check if curent user has admin access
            if (mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
            } else {

                Bloodrequest.findOne({  _id: deletedUser }, function(err, bloodrequest) {
                    if (err) throw err; // Throw error if cannot connect
                    // Check if user is in database
                    if (!bloodrequest) {
                        res.json({ success: false, message: 'No user found' }); // Return error
                    } else {
                        bloodrequest.request_status="approved";
                        // Save changes
                        bloodrequest.save(function(err) {
                            if (err) {
                                console.log(err); // Log any errors to the console
                            } else {
                                res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                            }
                        });
                    }
                });
            }
        }
    });
});
// Route to delete a user
router.put('/bloodrequestdecline/:_id', function(req, res) {
    var deletedUser = req.params._id; // Assign the username from request parameters to a variable
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
        if (err) throw err; // Throw error if cannot connect
        // Check if current user was found in database
        if (!mainUser) {
            res.json({ success: false, message: 'No user found' }); // Return error
        } else {
            // Check if curent user has admin access
            if (mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
            } else {

                Bloodrequest.findOne({  _id: deletedUser }, function(err, bloodrequest) {
                    if (err) throw err; // Throw error if cannot connect
                    // Check if user is in database
                    if (!bloodrequest) {
                        res.json({ success: false, message: 'No user found' }); // Return error
                    } else {
                        bloodrequest.request_status="declined";
                        // Save changes
                        bloodrequest.save(function(err) {
                            if (err) {
                                console.log(err); // Log any errors to the console
                            } else {
                                res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                            }
                        });
                    }
                });
            }
        }
    });
});
// Route to delete a user
router.put('/bloodrequestwaiting/:_id', function(req, res) {
    var deletedUser = req.params._id; // Assign the username from request parameters to a variable
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
        if (err) throw err; // Throw error if cannot connect
        // Check if current user was found in database
        if (!mainUser) {
            res.json({ success: false, message: 'No user found' }); // Return error
        } else {
            // Check if curent user has admin access
            if (mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
            } else {

                Bloodrequest.findOne({  _id: deletedUser }, function(err, bloodrequest) {
                    if (err) throw err; // Throw error if cannot connect
                    // Check if user is in database
                    if (!bloodrequest) {
                        res.json({ success: false, message: 'No user found' }); // Return error
                    } else {
                        bloodrequest.request_status="waiting";
                        // Save changes
                        bloodrequest.save(function(err) {
                            if (err) {
                                console.log(err); // Log any errors to the console
                            } else {
                                res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                            }
                        });
                    }
                });
            }
        }
    });
});

        //Route to get all users for management page
        router.get('/bloodbankchapters', function(req, res) {
            Bloodbankchapter.find({}, function(err, bloodbankchapters) {
                if (err) throw err; // Throw error if cannot connect
                Bloodbankchapter.findOne({ chapter_name: req.decoded.chapter_name}, function(err, mainUser) {
                    if (err) throw err; // Throw error if cannot connect
                    res.json({ success: true, bloodbankchapters: bloodbankchapters }); // Return users, along with current user's permission                       
                });
            });
        });


        /* Route to get all users for management page
            Bloodstock.find({$where: function() { return (this.critical_status == false && this.blood_stock <= 10) }}, function(err, bloodstocks) {
                if (err) throw err; // Throw error if cannot connect
                    Newsfeed.insert( { subject: "encourage", user: "10/10/2012",nw_content:"encourage" } );
            });
    */
    

    // Route to delete a user
    router.delete('/management/:username', function(req, res) {
        var deletedUser = req.params.username; // Assign the username from request parameters to a variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if current user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if curent user has admin access
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                } else {
                    // Fine the user that needs to be deleted
                    User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                        if (err) throw err; // Throw error if cannot connect
                        res.json({ success: true }); // Return success status
                    });
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/edit/:id', function(req, res) {
        var editUser = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if logged in user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if logged in user has editing privileges
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    // Find the user to be editted
                    User.findOne({ _id: editUser }, function(err, user) {
                        if (err) throw err; // Throw error if cannot connect
                        // Check if user to edit is in database
                        if (!user) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            res.json({ success: true, user: user }); // Return the user to be editted
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                }
            }
        });
    });

    // Route to update/edit a user
    router.put('/edit', function(req, res) {
        var editUser = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.name) var newName = req.body.name; // Check if a change to name was requested\
        if (req.body.lastname) var newLastname = req.body.lastname; // Check if a change to name was requested
        if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            // Check if logged in user is found in database
            if (!mainUser) {
                res.json({ success: false, message: "no user found" }); // Return erro
            } else {
                // Check if a change to name was requested
                if (newName) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user in database
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.name = newName; // Assign new name to user in database
                           
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

                if (newLastname) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user in database
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.lastname = newLastname; // Assign new name to user in database
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Last Name has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }


                // Check if a change to username was requested
                if (newUsername) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user in database
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.username = newUsername; // Save new username to user in database
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'Username has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

                // Check if change to e-mail was requested
                if (newEmail) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.email = newEmail; // Assign new e-mail to user in databse
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

                // Check if a change to permission was requested
                if (newPermission) {
                    // Check if user making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user to edit in database
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is found in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                // Check if attempting to set the 'user' permission
                                if (newPermission === 'user') {
                                    // Check the current permission is an admin
                                    if (user.permission === 'admin') {
                                        // Check if user making changes has access
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error
                                        } else {
                                            user.permission = newPermission; // Assign new permission to user
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Long error to console
                                                } else {
                                                    res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission; // Assign new permission to user
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                            }
                                        });
                                    }
                                }
                                // Check if attempting to set the 'moderator' permission
                                if (newPermission === 'moderator') {
                                    // Check if the current permission is 'admin'
                                    if (user.permission === 'admin') {
                                        // Check if user making changes has access
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' }); // Return error
                                        } else {
                                            user.permission = newPermission; // Assign new permission
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Log error to console
                                                } else {
                                                    res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission; // Assign new permssion
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                            }
                                        });
                                    }
                                }

                                // Check if assigning the 'admin' permission
                                if (newPermission === 'admin') {
                                    // Check if logged in user has access
                                    if (mainUser.permission === 'admin') {
                                        user.permission = newPermission; // Assign new permission
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                            }
                                        });
                                    } else {
                                        res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' }); // Return error
                                    }
                                }
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error

                    }
                }
            }
        });
    });



     // Route to get the user that needs to be edited
     router.get('/editbloodrequest/:id', function(req, res) {
        var editBloodrequest = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if logged in user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if logged in user has editing privileges
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    // Find the user to be editted
                    Bloodrequest.findOne({ _id: editBloodrequest }, function(err, bloodrequest) {
                        if (err) throw err; // Throw error if cannot connect
                        // Check if user to edit is in database
                        if (!bloodrequest) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            res.json({ success: true, bloodrequest: bloodrequest }); // Return the user to be editted
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/editremark/:id', function(req, res) {
        var editRemark = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if logged in user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if logged in user has editing privileges
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    // Find the user to be editted
                    Bloodrequest.findOne({ _id: editRemark }, function(err, bloodrequest) {
                        if (err) throw err; // Throw error if cannot connect
                        // Check if user to edit is in database
                        if (!bloodrequest) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            res.json({ success: true, bloodrequest: bloodrequest }); // Return the user to be editted
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                }
            }
        });
    });

     // Route to get the user that needs to be edited
     router.get('/editremarkapproved/:id', function(req, res) {
        var editRemarkapproved = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if logged in user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if logged in user has editing privileges
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    // Find the user to be editted
                    Bloodrequest.findOne({ _id: editRemarkapproved }, function(err, bloodrequest) {
                        if (err) throw err; // Throw error if cannot connect
                        // Check if user to edit is in database
                        if (!bloodrequest) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            res.json({ success: true, bloodrequest: bloodrequest }); // Return the user to be editted
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                }
            }
        });
    });



    // Route to update/edit a user
    router.put('/editbloodrequest', function(req, res) {
        var editBloodrequest = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.person_claimed) var newEmail = req.body.person_claimed; // Check if a change to e-mail was requested
        if (req.body.receipt_no) var newReceipt = req.body.receipt_no; // Check if a change to e-mail was requested

        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            // Check if logged in user is found in database
            if (!mainUser) {
                res.json({ success: false, message: "no user found" }); // Return erro
            } else {
                // Check if a change to name was requested
                // Check if change to e-mail was requested
                if (newEmail) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        Bloodrequest.findOne({ _id: editBloodrequest}, function(err, bloodrequest) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!bloodrequest) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                bloodrequest.person_claimed = newEmail; // Assign new e-mail to user in databse
                                // Save changes
                                bloodrequest.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

                if (newReceipt) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        Bloodrequest.findOne({ _id: editBloodrequest}, function(err, bloodrequest) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!bloodrequest) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                bloodrequest.receipt_no = newReceipt; // Assign new e-mail to user in databse
                                bloodrequest.request_status = "claimed";
                                // Save changes
                                bloodrequest.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
            }
        });
    });




    // Route to update/edit a user
    router.put('/editremark', function(req, res) {
        var editRemark = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.remarks) var newRemark = req.body.remarks; // Check if a change to e-mail was requested
    
        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            // Check if logged in user is found in database
            if (!mainUser) {
                res.json({ success: false, message: "no user found" }); // Return erro
            } else {
                // Check if a change to name was requested
                // Check if change to e-mail was requested
                if (newRemark) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        Bloodrequest.findOne({ _id: editRemark}, function(err, bloodrequest) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!bloodrequest) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                bloodrequest.remarks = newRemark; // Assign new e-mail to user in databse
                                bloodrequest.request_status = 'declined'; // Assign new e-mail to user in databse
                                // Save changes
                                bloodrequest.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'Remark has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
            }
        });
    });

    
    // Route to update/edit a user
    router.put('/editremarkapproved', function(req, res) {
        var editRemarkapproved = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.remarksapproved) var newRemarkapproved = req.body.remarksapproved; // Check if a change to e-mail was requested
    
        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            // Check if logged in user is found in database
            if (!mainUser) {
                res.json({ success: false, message: "no user found" }); // Return erro
            } else {
                // Check if a change to name was requested
                // Check if change to e-mail was requested
                if (newRemarkapproved) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        Bloodrequest.findOne({ _id: editRemarkapproved}, function(err, bloodrequest) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!bloodrequest) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                bloodrequest.remarksapproved = newRemarkapproved; // Assign new e-mail to user in databse
                                bloodrequest.request_status = 'approved'; // Assign new e-mail to user in databse
                                // Save changes
                                bloodrequest.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'Remark has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
            }
        });
    });


    
    return router; // Return the router object to server
};
