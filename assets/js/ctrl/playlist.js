"use strict";

const angular = require("angular");

angular.module("mixtape").controller("PlaylistCtrl", function($scope, $routeParams, FirebaseFactory, SpotifyPlaylistFactory) {
    $scope.playlistId = $routeParams.id;
    $scope.uid = $routeParams.uid;
    SpotifyPlaylistFactory.getPlaylistByIds($scope.uid, $scope.playlistId)
        .then(playlist => {
            $scope.music = SpotifyPlaylistFactory.parseApiInfo(playlist);
            console.log(playlist);
            $scope.tracks = playlist.tracks.items;
        });
});