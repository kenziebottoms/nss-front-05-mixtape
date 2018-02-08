"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TrackCtrl", function($scope, SpotifySearchFactory, $routeParams, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    SpotifySearchFactory.getTrackById($scope.id)
        .then(track => {
            let typeId = `track:${$scope.id}`;

            // update cached info in Firebase
            track = SpotifySearchFactory.parseApiInfo("track", track);
            FirebaseFactory.storeMusic(typeId, track);

            // pass data to dom
            $scope.music = track;
            return LinkFactory.getLinksByMusic(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
        });
});