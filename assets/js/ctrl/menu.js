"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, spotify, SpotifyUserFactory) {
    let token = SpotifyUserFactory.getActiveToken();
    $scope.menu = [];
    if (token) {
        $scope.login = false;
    } else {
        $scope.login = true;
        $scope.key = spotify.key;
    }
});