"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $controller, $routeParams, $q, LinkFactory, VoteFactory) {
    
    // gets voting, deletion, playback methods from LinkCardCtrl
    $controller("LinkCardCtrl", {$scope: $scope});

    $scope.id = $routeParams.id;
    
    // promises list of all loaded links connected to this piece of media
    $scope.getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMedia($scope.typeId)
                .then(links => {
                    $scope.links = links;
                    $scope.context = "media";
                    resolve();
                });
        });
    };
});