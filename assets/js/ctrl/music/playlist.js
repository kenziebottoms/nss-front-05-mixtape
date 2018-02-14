"use strict";

angular.module("mixtape").controller("PlaylistCtrl", function($scope, $q, $controller, $routeParams, SpotifyPlaylistFactory, SpotifyAuthFactory, FirebaseFactory) {
    
    $controller("MusicCtrl", {$scope: $scope});
    
    $scope.playlistId = $routeParams.id;
    $scope.uid = $routeParams.uid;
    $scope.typeId = `playlist:${$scope.uid}:${$scope.playlistId}`;

    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            SpotifyPlaylistFactory.getPlaylistByIds($scope.uid, $scope.playlistId)
                .then(playlist => {
                    $scope.tracks = playlist.tracks.items;
                    $scope.music = SpotifyPlaylistFactory.parseApiInfo(playlist);
                    resolve();
                    FirebaseFactory.storeMusic($scope.typeId, $scope.music);
                });
        });
    };
    let getOwnerData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getUserData($scope.uid)
                .then(user => {
                    $scope.owner = user;
                    resolve();
                }); 
        });
    };

    $scope.fetchInfo();
    getOwnerData();

    Promise.all([
        $scope.getUserData(),
        $scope.getLinks($scope.typeId)
    ])
        .then(response => {
            $scope.getVotes();
        });
});