"use strict";

const angular = require("angular");

angular.module("mixtape").controller("NewLinkCtrl", function($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location, TMDB, SpotifySearchFactory) {
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
        })
        .catch(err => {
            $location.path("/");
        });

    $scope.searchMedia = () => {
        if ($scope.mediaSearchTerm != "" && $scope.activeMedia) {
            $scope.results = {};
            if ($scope.activeMedia == "books") {
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
            } else if ($scope.activeMedia == "movies") {
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
            if ($scope.activeMusic == "tracks") {
                SpotifySearchFactory.searchTracksByTitle($scope.musicSearchTerm)
                    .then(results => {
                        $scope.musicResults = results.slice(0,5);
                    });
            }
        }
    };
});