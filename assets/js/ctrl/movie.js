"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    let typeId = `movie:${$scope.id}`;
    TmdbFactory.getMovieById($scope.id)
        .then(movie => {
            // update cached info in Firebase
            movie =  TmdbFactory.parseApiInfo("movie", movie);
            FirebaseFactory.storeMedia(typeId, movie);

            // pass data to dom
            $scope.media = movie;
        });
    LinkFactory.getLinksByMedia(typeId)        
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});