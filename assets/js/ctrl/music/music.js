"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MusicCtrl", function($scope, $q, $controller, $location, VoteFactory, SpotifyAuthFactory, LinkFactory) {
    
    $controller("LinkCardCtrl", {$scope: $scope});

    $scope.getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMusic($scope.typeId)
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
                    resolve();
                });
        });
    };

});