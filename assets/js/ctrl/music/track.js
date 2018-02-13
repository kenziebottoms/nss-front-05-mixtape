"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TrackCtrl", function($scope, $q, SpotifyTrackFactory, $routeParams, LinkFactory, VoteFactory, FirebaseFactory, SpotifyAuthFactory) {
    $scope.id = $routeParams.id;
    let typeId = `track:${$scope.id}`;

    let getTrack = () => {
        return $q((resolve, reject) => {
            SpotifyTrackFactory.getTrackById($scope.id)
                .then(track => {
                    // update cached info in Firebase
                    track = SpotifyTrackFactory.parseApiInfo(track);
                    FirebaseFactory.storeMusic(typeId, track);
                    resolve();
                    // pass data to dom
                    $scope.music = track;
                });
        });
    };
    let getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMusic(typeId)
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
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
    let getUserData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getActiveUserData()
                .then(data => {
                    $scope.user = data;
                    resolve();
                });
        });
    };

    let promises = [];
    promises.push(getLinks(), getTrack(), getUserData());
    Promise.all(promises)
        .then(response => {
            getVotes();
        });
});