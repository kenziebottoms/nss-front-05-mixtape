"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TrackCtrl", function($scope, $q, $routeParams, $controller, SpotifyTrackFactory, FirebaseFactory, MusixmatchFactory) {

    // gets link loading methods from MusicCtrl
    $controller("MusicCtrl", {$scope: $scope});

    // gets track info straight from Spotify
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            SpotifyTrackFactory.getTrackById($scope.id)
                .then(track => {
                    // clean up data for display and storage
                    $scope.music = SpotifyTrackFactory.parseApiInfo(track);
                    resolve();
                    // update info in Firebase
                    FirebaseFactory.storeMusic($scope.typeId, $scope.music);
                });
        });
    };

    // retrieves song lyrics
    let getLyrics = () => {
        return $q((resolve, reject) => {
            MusixmatchFactory.getLyrics($scope.music.title, $scope.music.subtitle)
                .then(data => resolve(data));
        });
    };
    
    $scope.id = $routeParams.id;
    $scope.typeId = `track:${$scope.id}`;
    $scope.fetchInfo()
        .then(response => {
            getLyrics()
                .then(lyrics => {
                    if (lyrics.lyrics_body != "") {
                        let lyricText = lyrics.lyrics_body;
                        lyricText = lyricText.slice(0, lyricText.indexOf("*"));
                        $scope.lyrics = lyricText.trim();
                    }
                });
        });

    // after user data and links are fetched and parsed, get the votes
    Promise.all([
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ])
        .then(response => {
            $scope.getVotes();
        });
});