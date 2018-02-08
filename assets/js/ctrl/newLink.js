"use strict";

const angular = require("angular");

angular.module("mixtape").controller("NewLinkCtrl", function($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location, TMDB, SpotifySearchFactory, FirebaseFactory, $q, LinkFactory) {
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
            $scope.uid = data.username;
        })
        .catch(err => {
            $location.path("/");
        });

    $scope.searchMedia = () => {
        if ($scope.mediaSearchTerm != "" && $scope.activeMedia) {
            $scope.results = {};
            if ($scope.activeMedia == "book") {
                GoodreadsFactory.searchByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.work.slice(0,5);
                    });
            } else if ($scope.activeMedia == "tv") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchTvShowsByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.slice(0,5);
                    });
            } else if ($scope.activeMedia == "movie") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchMoviesByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.slice(0,5);
                    });
            }
        }
    };

    $scope.searchMusic = () => {
        if ($scope.searchMusicTerm != "" && $scope.activeMusic) {
            if ($scope.activeMusic == "track") {
                SpotifySearchFactory.searchTracksByTitle($scope.musicSearchTerm)
                    .then(results => {
                        $scope.musicResults = results.slice(0,5);
                    });
            }
        }
    };

    $scope.selectMedia = (id) => {
        if ($scope.activeMedia == "tv") {
            TmdbFactory.getTvShowById(id)
                .then(show => {
                    $scope.selectedMedia = TmdbFactory.parseApiInfo("tv", show);
                });
        } else if ($scope.activeMedia == "movie") {
            TmdbFactory.getMovieById(id)
                .then(movie => {
                    $scope.selectedMedia = TmdbFactory.parseApiInfo("movie", movie);
                });
        } else if ($scope.activeMedia == "book") {
            GoodreadsFactory.getBookById(id)
                .then(book => {
                    $scope.selectedMedia = GoodreadsFactory.parseApiInfo(book);
                });
        }
    };

    $scope.selectMusic = (id) => {
        if ($scope.activeMusic == "track") {
            SpotifySearchFactory.getTrackById(id)
                .then(track => {
                    $scope.selectedMusic = SpotifySearchFactory.parseApiInfo("track", track);
                });
        }
    };

    $scope.submit = () => {
        return $q((resolve, reject) => {
            if ($scope.selectedMedia && $scope.selectedMusic) {
                let mediaTypeId = `${$scope.activeMedia}:${$scope.selectedMedia.id}`;
                let musicTypeId = `${$scope.activeMusic}:${$scope.selectedMusic.id}`;
                let promises = [];
                promises.push(FirebaseFactory.storeMedia(mediaTypeId, $scope.selectedMedia));
                promises.push(FirebaseFactory.storeMusic(musicTypeId, $scope.selectedMusic));
                Promise.all(promises)
                    .then(response => {
                        return LinkFactory.storeNewLink(mediaTypeId, musicTypeId, [], $scope.uid);
                    })
                    .then(response => resolve(response))
                    .catch(err => reject(err));
            } else {
                reject("Please select music and media.");
            }
        });
    };
});