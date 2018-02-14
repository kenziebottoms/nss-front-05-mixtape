"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MusicCtrl", function($scope, $q, $controller, $location, VoteFactory, SpotifyAuthFactory, LinkFactory) {
    
    $controller("LinkCardCtrl", {$scope: $scope});

    $scope.getLinks = (typeId) => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMusic(typeId)
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
                    resolve();
                });
        });
    };
    $scope.getUserData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getActiveUserData()
                .then(data => {
                    $scope.user = data;
                    resolve();
                })
                .catch(err => $location.path("/"));
        });
    };

    $scope.afterDelete = () => {
        $scope.getLinks();
    };

});