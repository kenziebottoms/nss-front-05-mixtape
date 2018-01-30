"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, spotify, SpotifyUserFactory, $location) {
    let token = SpotifyUserFactory.getActiveToken();
    $scope.menu = [];
    if (token) {
        $scope.logout = true;
        $scope.login = false;
    } else {
        $scope.logout = false;
        $scope.login = true;
        $scope.key = spotify.key;
    }

    $scope.logOut = () => {
        SpotifyUserFactory.logOut();
        $scope.logout = false;
        $scope.login = true;
    };
});