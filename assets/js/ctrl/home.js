"use strict";

const angular = require("angular");

angular.module("mixtape").controller("HomeCtrl", function($scope, $routeParams, $location, SpotifyAuthFactory, MediaFactory, TMDB) {
    MediaFactory.getMediaByType("movie", 4)
        .then(data => {
            $scope.movies = data;
            $scope.tmdbPrefix = TMDB.image_prefix;
        })
        .catch(err => console.log(err));
    MediaFactory.getMediaByType("tv", 4)
        .then(data => {
            $scope.tvShows = data;
            $scope.tmdbPrefix = TMDB.image_prefix;
        })
        .catch(err => console.log(err));
});