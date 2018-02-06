"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory) {
    $scope.id = $routeParams.id;
    TmdbFactory.getMovieById($scope.id)
        .then(movie => {
            movie.poster_path = TMDB.image_prefix + movie.poster_path;
            movie.year = movie.release_date.substr(0,4);
            $scope.movie = movie;
            let typeId = `movie:${movie.id}`;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});