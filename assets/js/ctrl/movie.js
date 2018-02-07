"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    TmdbFactory.getMovieById($scope.id)
        .then(movie => {
            let typeId = `movie:${movie.id}`;
            // update cached info in Firebase
            movie =  TmdbFactory.parseApiInfo("movie", movie);
            FirebaseFactory.cacheInfo(typeId, movie);

            // pass data to dom
            $scope.movie = movie;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});