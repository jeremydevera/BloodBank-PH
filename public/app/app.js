angular.module('userApp', ['appRoutes', 'userControllers', 
'adddeferralControllers','addblooddonationControllers','userServices','addbloodrequestControllers',
'bloodrequestServices','bloodbankchapterServices','blooddonationServices','newsfeedControllers',
'bloodrequestControllers','bloodbankchapterControllers','blooddonationControllers',
'newsfeedmanageController', 'newsfeedServices', 'ngAnimate', 'mainController', 
'authServices', 'emailController', 'managementController', 'deferreddonorsControllers',
'bloodinventoryControllers','bloodinventoryServices',
'bloodnoticeControllers','bloodnoticeServices', 'dashboardControllers', 'dashboardServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
