"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MusicCtrl", function($scope, $q, $controller, LinkFactory) {
    
    // gets voting, deletion, playback methods from LinkCardCtrl
    $controller("LinkCardCtrl", {$scope: $scope});

    // promises list of all loaded links connected to this piece of music
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