"use strict";

const angular = require("angular");

angular.module("mixtape").controller("UserCtrl", function($scope, $rootScope, $q, $location, SpotifyAuthFactory) {

    // promises active user data from localStorage or Spotify
    let getUserData = () => {
        SpotifyAuthFactory.getActiveUserData()
            .then(data => {
                $scope.user = data;
            })
            .catch(err => $scope.user = null);
    };

    // checks for Spotify callback info
    let hash = $location.hash();
    if (hash) {
        // stores token received from Spotify and active user data in localStorage, broadcast userChange to MenuCtrl
        SpotifyAuthFactory.login(hash).then(userData => {
            $scope.user = userData;
            $rootScope.$broadcast('userChange', userData);
            // erases hash
            $location.hash("");
        });
    } else {
        getUserData();
    }
    
    // listens for userChange from MenuCtrl
    $scope.$on('userChange', (event, user) => {
        $scope.user = user;
    });

    // broadcasts userChange for MenuCtrl, clears localStorage
    $scope.logout = () => {
        $scope.user = null;
        SpotifyAuthFactory.logout();
        $rootScope.$broadcast('userChange', null);
    };
});