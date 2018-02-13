"use strict";

const angular = require("angular");

angular.module("mixtape").controller("PlaylistCtrl", function($scope, $q, $routeParams, FirebaseFactory, SpotifyPlaylistFactory, LinkFactory, SpotifyAuthFactory, VoteFactory) {
    let getPlaylist = () => {
        SpotifyPlaylistFactory.getPlaylistByIds($scope.uid, $scope.playlistId)
            .then(playlist => {
                $scope.tracks = playlist.tracks.items;
                $scope.music = SpotifyPlaylistFactory.parseApiInfo(playlist);
                FirebaseFactory.storeMusic(`playlist:${$scope.uid}:${$scope.playlistId}`, $scope.music);
            });
    };
    let getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMusic(`playlist:${$scope.uid}:${$scope.playlistId}`)
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
                    resolve();
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
    
    let getUserData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getActiveUserData()
                .then(data => {
                    $scope.user = data;
                    resolve();
                });
        });
    };

    let getVotes = () => {
        let linkVotePromises = $scope.links.filter(link => {
            return link.uid != $scope.user.id;
        }).map(link => {
            return VoteFactory.loadVote(link, $scope.user.id);
        });
    };
    $scope.playlistId = $routeParams.id;
    $scope.uid = $routeParams.uid;
    getPlaylist();
    getOwnerData();

    let promises = [];
    promises.push(getUserData(), getLinks());
    
    Promise.all(promises)
        .then(response => {
            getVotes();
        });
});