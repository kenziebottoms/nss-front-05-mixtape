"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory) {
    $scope.id = $routeParams.id;
    TmdbFactory.getTvShowById($scope.id)
        .then(show => {
            show.poster_path = TMDB.image_prefix + show.poster_path;
            show.year = show.first_air_date.substr(0,4);
            $scope.show = show;
            let typeId = `tv:${show.id}`;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});