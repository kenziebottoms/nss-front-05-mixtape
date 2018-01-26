"use strict";

const angular = require("angular");
const myApp = angular.module("mixtape");

myApp.controller("SpotifyTrackSearchCtrl", function($scope, SpotifyFactory) {
    SpotifyFactory.searchTracksByTitle("star").then(results => {
        console.log(results.data);
    });
});