"use strict";

const angular = require("angular");

angular.module("mixtape").controller("HomeCtrl", function($scope, $routeParams, $location, SpotifyAuthFactory, FirebaseFactory, TMDB) {
    FirebaseFactory.getMediaByType("movie", 5)
        .then(data => {
            $scope.movies = data;
        })
        .catch(err => console.log(err));
    
    FirebaseFactory.getMediaByType("tv", 5)
        .then(data => {
            $scope.tvShows = data;
        })
        .catch(err => console.log(err));
    FirebaseFactory.getMediaByType("book", 5)
        .then(data => {
            $scope.books = data;
        });
});