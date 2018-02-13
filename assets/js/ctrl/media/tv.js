"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, $controller, TmdbFactory, TMDB, FirebaseFactory) {

    $controller("MediaCtrl", {$scope: $scope});    

    $scope.fetchInfo = (typeId) => {
        TmdbFactory.getTvShowById($scope.id)
        .then(show => {
            // update cached info in firebase
            show = TmdbFactory.parseApiInfo("tv", show);
            // pass data to dom
            $scope.media = show;
            FirebaseFactory.cacheMedia(typeId, show);
        });
    };

    $scope.typeId = `tv:${$scope.id}`;
    
    $scope.fetchInfo($scope.typeId);
    $scope.getLinks($scope.typeId);
});