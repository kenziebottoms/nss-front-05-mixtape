"use strict";

angular.module("mixtape").controller("SearchCtrl", function($scope, SpotifyTrackFactory, $routeParams) {
    $scope.term = $routeParams.term;
    SpotifyTrackFactory.searchTracksByTitle($scope.term).then(({data}) => {
        $scope.tracks = data.tracks.items;
    });
});