"use strict";

const angular = require("angular");

angular.module("mixtape").controller("NewLinkCtrl", function($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location) {
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
                        console.log(results);
                        $scope.results = results.results.work.slice(0,5);
                    });
            }
        }
    };
});