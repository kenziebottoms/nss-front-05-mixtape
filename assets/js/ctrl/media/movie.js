"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, $q, $controller, TmdbFactory, FirebaseFactory) {
    
    // gets link loading methods from MediaCtrl
    $controller("MediaCtrl", {$scope: $scope});
    
    // get movie details straight from TMDb
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            $scope.media = null;
            TmdbFactory.getMovieById($scope.id)
                .then(movie => {
                    // clean up data for display and storage
                    $scope.media = TmdbFactory.parseApiInfo("movie", movie);
                    resolve();
                    // update cached info in Firebase
                    FirebaseFactory.cacheMedia($scope.typeId, $scope.media);
                });
        });
    };
        
    $scope.fetchInfo($scope.typeId);
    $scope.typeId = `movie:${$scope.id}`;
    
    // after links and user data have been fetched, get votes
    Promise.all([
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ])
    .then(results => {
        $scope.getVotes();
    });
});