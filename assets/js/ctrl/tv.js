"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    TmdbFactory.getTvShowById($scope.id)
        .then(show => {
            let typeId = `tv:${show.id}`;
            // update cached info in firebase
            FirebaseFactory.cacheInfo(typeId, TmdbFactory.parseApiInfo("tv", show));

            // complete poster path
            show.year = show.first_air_date.slice(0,4);
            show.poster_path = TMDB.image_prefix + show.poster_path;

            // pass data to dom
            $scope.show = show;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});