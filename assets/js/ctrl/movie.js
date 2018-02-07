"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    TmdbFactory.getMovieById($scope.id)
        .then(movie => {
            let typeId = `movie:${movie.id}`;
            // update cached info in Firebase
            FirebaseFactory.cacheInfo(typeId, TmdbFactory.parseApiInfo("movie", movie));

            // finish movie poster path
            movie.poster_path = TMDB.image_prefix + movie.poster_path;

            // pass data to dom
            $scope.movie = movie;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});