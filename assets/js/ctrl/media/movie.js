"use strict";

angular.module("mixtape").controller("MovieCtrl", function($scope, $q, $controller, $routeParams, TmdbFactory, TMDB, FirebaseFactory) {
    
    $controller("MediaCtrl", {$scope: $scope});
    $scope.typeId = `movie:${$scope.id}`;
    
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
    
    let promises = [
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ];

    Promise.all(promises)
        .then(results => {
            $scope.getVotes();
        });
});