"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyAuthFactory) {
    let token = SpotifyAuthFactory.getActiveToken();
    $scope.menu = [];
    if (token) {
        $scope.login = false;
    } else {
        $scope.login = true;
        $scope.key = SPOTIFY.key;
    }
});