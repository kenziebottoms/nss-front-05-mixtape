"use strict";

const angular = require("angular");

angular.module("mixtape").controller("homeCtrl", function($scope, $routeParams, $location, SpotifyUserFactory, MediaFactory) {
    MediaFactory.getRecentMovies(4)
        .then(data => {
            $scope.movies = data;
        })
        .catch(err => console.log(err));
});