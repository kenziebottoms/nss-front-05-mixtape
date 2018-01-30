"use strict";

const angular = require("angular");

angular.module("mixtape").controller("homeCtrl", function($scope, $routeParams, $location, SpotifyUserFactory) {
    let hash = $location.hash();
    if (hash) {
        SpotifyUserFactory.logIn(hash);
        $location.hash("");
    }
});