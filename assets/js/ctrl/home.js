"use strict";

const angular = require("angular");

angular.module("mixtape").controller("HomeCtrl", function($scope, $routeParams, $location, SpotifyAuthFactory, FirebaseFactory, TMDB) {
    FirebaseFactory.getMediaByType("movie", 4)
        .then(data => {
            $scope.movies = data;
            $scope.tmdbPrefix = TMDB.image_prefix;
        })
        .catch(err => console.log(err));
    FirebaseFactory.getMediaByType("tv", 4)
        .then(data => {
            $scope.tvShows = data;
            $scope.tmdbPrefix = TMDB.image_prefix;
        })
        .catch(err => console.log(err));
});