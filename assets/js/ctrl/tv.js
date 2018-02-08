"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    TmdbFactory.getTvShowById($scope.id)
        .then(show => {
            let typeId = `tv:${show.id}`;
            // update cached info in firebase
            show = TmdbFactory.parseApiInfo("tv", show);
            FirebaseFactory.storeMedia(typeId, show);

            // pass data to dom
            $scope.media = show;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});