"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $controller, $routeParams, $q, LinkFactory, VoteFactory) {

    $controller("LinkCardCtrl", {$scope: $scope});

    $scope.id = $routeParams.id;
    
    $scope.getLinks = (typeId) => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMedia(typeId)
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
                    $scope.context = "media";
                    resolve();
                });
        });
    };
});