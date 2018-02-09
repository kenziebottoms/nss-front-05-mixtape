"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TrackCtrl", function($scope, SpotifyTrackFactory, $routeParams, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    SpotifyTrackFactory.getTrackById($scope.id)
        .then(track => {
            let typeId = `track:${$scope.id}`;

            // update cached info in Firebase
            track = SpotifyTrackFactory.parseApiInfo("track", track);
            FirebaseFactory.storeMusic(typeId, track);

            // pass data to dom
            $scope.music = track;
            return LinkFactory.getLinksByMusic(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
        });
});