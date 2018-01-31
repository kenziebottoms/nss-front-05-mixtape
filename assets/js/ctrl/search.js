"use strict";

const angular = require("angular");

angular.module("mixtape").controller("SearchCtrl", function($scope, SpotifySearchFactory, $routeParams) {
    $scope.term = $routeParams.term;
    SpotifySearchFactory.searchTracksByTitle($scope.term).then(({data}) => {
        $scope.tracks = data.tracks.items;
    });
});