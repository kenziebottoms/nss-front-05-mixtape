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
                    $scope.media = TmdbFactory.parseApiInfo("movie", movie);
                    resolve();
                    FirebaseFactory.cacheMedia($scope.typeId, $scope.media);
                });
            });
        };
        
        $scope.fetchInfo($scope.typeId);
        $scope.typeId = `movie:${$scope.id}`;
        
        Promise.all([
            $scope.getLinks($scope.typeId),
            $scope.getUserData()
        ])
        .then(results => {
            $scope.getVotes();
        });
    });