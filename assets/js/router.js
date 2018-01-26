"use strict";

const angular = require("angular");
const myApp = angular.module("mixtape");

myApp.config($routeProvider => {
    $routeProvider
        .when("/search/songs/:term", {
            templateUrl: "assets/partials/spotifyTrack.html",
            controller: "SpotifyTrackSearchCtrl"
        });
});