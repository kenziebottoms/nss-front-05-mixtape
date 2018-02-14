"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, $rootScope, SPOTIFY, SpotifyAuthFactory) {
    $scope.key = SPOTIFY.key;
    
    // fetches active user data from Spotify or localStorage
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
        })
        .catch(err => $scope.user = null);

    // watches for userChange which happens in UserCtrl
    $scope.$on('userChange', (event, user) => {
        $scope.user = user;
    });

    // removes localStorage info and broadcasts userChange to UserCtrl
    $scope.logout = () => {
        $scope.user = null;
        SpotifyAuthFactory.logout();
        $rootScope.$broadcast('userChange', null);
    };
});