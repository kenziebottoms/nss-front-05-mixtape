"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyUserFactory) {
    let token = SpotifyUserFactory.getActiveToken();
    $scope.menu = [];
    if (token) {
        $scope.login = false;
    } else {
        $scope.login = true;
        $scope.key = SPOTIFY.key;
    }
});