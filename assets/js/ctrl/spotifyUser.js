"use strict";

const angular = require("angular");

angular.module("mixtape").controller("SpotifyUserCtrl", function($scope, SpotifyUserFactory, $location, $window) {
    let hash = $location.hash();
    if (hash) {
        SpotifyUserFactory.login(hash).then(userData => {
            $scope.user = userData;
            $location.hash("");
        });
    } else {
        SpotifyUserFactory.getUserData().then(data => {
            $scope.user = data;
        }).catch(err => console.log(err));
    }

    $scope.logout = () => {
        $scope.user = null;
        SpotifyUserFactory.logout();
        $scope.login = true;
    };
});