"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, $q, $controller, $routeParams, TmdbFactory, TMDB, FirebaseFactory) {

    $controller("MediaCtrl", {$scope: $scope});

    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            $scope.media = null;
            TmdbFactory.getMovieById($scope.id)
                .then(movie => {
                    // update cached info in Firebase
                    movie =  TmdbFactory.parseApiInfo("movie", movie);
                    // pass data to dom
                    $scope.media = movie;
                    resolve();
                    FirebaseFactory.cacheMedia($scope.typeId, movie);
                });
        });
    };

    $scope.typeId = `movie:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);
    
    let promises = [
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ];

    Promise.all(promises)
        .then(results => {
            $scope.getVotes();
        });
});