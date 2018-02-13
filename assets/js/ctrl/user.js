"use strict";

const angular = require("angular");

angular.module("mixtape").controller("UserCtrl", function($scope, $rootScope, $q, SpotifyAuthFactory, $location, $window) {
    let getUserData = () => {
        SpotifyAuthFactory.getActiveUserData()
            .then(data => {
                $scope.user = data;
                if (!data.username) {
                    $scope.user.username = data.uri.split(":")[2];
                }
        });    
    };
    let hash = $location.hash();
    if (hash) {
        SpotifyAuthFactory.login(hash).then(userData => {
            $scope.user = userData;
            $rootScope.$broadcast('userChange', userData);
            $location.hash("");
        });
    } else {
        getUserData();
    }
    
    $scope.$on('userChange', (event, user) => {
        $scope.user = user;
    });

    $scope.logout = () => {
        $scope.user = null;
        SpotifyAuthFactory.logout();
        $rootScope.$broadcast('userChange', null);
    };
});