"use strict";

const angular = require("angular");

angular.module("mixtape").controller("PlaylistCtrl", function($scope, $q, $controller, $routeParams, SpotifyPlaylistFactory, SpotifyAuthFactory, FirebaseFactory) {

    // gets link loading methods from MusicCtrl
    $controller("MusicCtrl", {$scope: $scope});

    // gets playlist info straight from Spotify
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            SpotifyPlaylistFactory.getPlaylistByIds($scope.uid, $scope.playlistId)
                .then(playlist => {
                    // clean up data for display and storage
                    $scope.music = SpotifyPlaylistFactory.parseApiInfo(playlist);
                    $scope.tracks = playlist.tracks.items;
                    resolve();
                    // update info in Firebase
                    FirebaseFactory.storeMusic($scope.typeId, $scope.music);
                });
        });
    };

    // promises user data on the owner of this playlist
    let getOwnerData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getUserData($scope.uid)
                .then(user => {
                    $scope.owner = user;
                    resolve();
                }); 
        });
    };

    $scope.playlistId = $routeParams.id;
    $scope.uid = $routeParams.uid;
    $scope.typeId = `playlist:${$scope.uid}:${$scope.playlistId}`;
    $scope.fetchInfo();
    getOwnerData();

    // after user data and links are fetched and parsed, get the votes
    Promise.all([
        $scope.getUserData(),
        $scope.getLinks($scope.typeId)
    ])
        .then(response => {
            $scope.getVotes();
        });
});