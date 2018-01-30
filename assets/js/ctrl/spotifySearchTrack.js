"use strict";

const angular = require("angular");

angular.module("mixtape").controller("SpotifySearchCtrl", function($scope, SpotifySearchFactory) {
    SpotifySearchFactory.searchTracksByTitle("star").then(results => {
        console.log(results.data);
    });
});