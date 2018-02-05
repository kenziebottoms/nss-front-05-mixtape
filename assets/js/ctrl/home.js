"use strict";

const angular = require("angular");

angular.module("mixtape").controller("homeCtrl", function($scope, $routeParams, $location, SpotifyUserFactory, MediaFactory, TMDB) {
    MediaFactory.getRecentMovies(4)
        .then(data => {
            $scope.movies = data;
            $scope.moviePrefix = TMDB.image_prefix;
        })
        .catch(err => console.log(err));
});