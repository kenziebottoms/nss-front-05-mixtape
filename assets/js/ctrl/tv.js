"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    let typeId = `tv:${$scope.id}`;
    TmdbFactory.getTvShowById($scope.id)
        .then(show => {
            // update cached info in firebase
            show = TmdbFactory.parseApiInfo("tv", show);
            // pass data to dom
            $scope.media = show;
            FirebaseFactory.cacheMedia(typeId, show);
        });
    LinkFactory.getLinksByMedia(typeId)
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});