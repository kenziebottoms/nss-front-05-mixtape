"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyAuthFactory) {
    $scope.token = SpotifyAuthFactory.getActiveToken();
    $scope.menu = [];
    if (!$scope.token) {
        $scope.key = SPOTIFY.key;
    }

    $scope.logout = () => {
        $scope.login = true;
        $scope.logout = false;
        SpotifyAuthFactory.logout();
    };
});