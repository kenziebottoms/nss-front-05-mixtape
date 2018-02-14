"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, $q, $controller, TmdbFactory, TMDB, FirebaseFactory) {

    $controller("MediaCtrl", {$scope: $scope});    

    $scope.fetchInfo = (typeId) => {
        return $q((resolve, reject) => {
            TmdbFactory.getTvShowById($scope.id)
                .then(show => {
                    // update cached info in firebase
                    show = TmdbFactory.parseApiInfo("tv", show);
                    // pass data to dom
                    $scope.media = show;
                    resolve();
                    FirebaseFactory.cacheMedia(typeId, show);
                });
        });
    };

    $scope.typeId = `tv:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);

    Promise.all([
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ])
        .then(results => {
            $scope.getVotes();
        });
});