"use strict";

const angular = require("angular");

angular.module("mixtape").controller("PlaylistCtrl", function($scope, $routeParams, FirebaseFactory, SpotifyPlaylistFactory, LinkFactory, SpotifyAuthFactory) {
    $scope.playlistId = $routeParams.id;
    $scope.uid = $routeParams.uid;
    SpotifyPlaylistFactory.getPlaylistByIds($scope.uid, $scope.playlistId)
        .then(playlist => {
            $scope.music = SpotifyPlaylistFactory.parseApiInfo(playlist);
            $scope.tracks = playlist.tracks.items;
            return LinkFactory.getLinksByMusic(`playlist:${$scope.uid}:${$scope.playlistId}`);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
        });
    SpotifyAuthFactory.getUserData($scope.uid)
        .then(user => {
            $scope.user = user;
        });
});