"use strict";

const angular = require("angular");
const myApp = angular.module("mixtape");

myApp.config($routeProvider => {
    $routeProvider
        .when("/search/songs/:term", {
            templateUrl: "assets/partials/spotifyTrack.html",
            controller: "SpotifySearchCtrl"
        })
        // doesn't work
        .when("/", {
            templateUrl: "assets/partials/home.html",
            controller: "homeCtrl"
        });
});