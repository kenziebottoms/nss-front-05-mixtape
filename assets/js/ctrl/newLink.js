"use strict";

const angular = require("angular");

angular.module("mixtape").controller("NewLinkCtrl", function($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location, TMDB) {
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
        })
        .catch(err => {
            $location.path("/");
        });

    $scope.search = () => {
        if ($scope.mediaSearchTerm != "") {
            if ($scope.active == "books") {
                GoodreadsFactory.searchByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.results = results.results.work.slice(0,5);
                    });
            } else if ($scope.active == "tv") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchTvShowsByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.results = results.results.slice(0,5);
                    });
            } else if ($scope.active == "movies") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchMoviesByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.results = results.results.slice(0,5);
                    });
            }
        }
    };
});