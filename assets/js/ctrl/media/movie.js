"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, $controller, $routeParams, TmdbFactory, TMDB, FirebaseFactory) {

    $controller("MediaCtrl", {$scope: $scope});

    $scope.fetchInfo = () => {
        $scope.media = null;
        TmdbFactory.getMovieById($scope.id)
            .then(movie => {
                // update cached info in Firebase
                movie =  TmdbFactory.parseApiInfo("movie", movie);
                // pass data to dom
                $scope.media = movie;
                
                FirebaseFactory.cacheMedia($scope.typeId, movie);
            });
    };
    $scope.typeId = `movie:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);
    $scope.getLinks($scope.typeId);
});