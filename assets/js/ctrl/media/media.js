"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $controller, $routeParams, $q, LinkFactory, VoteFactory) {

    $controller("LinkCardCtrl", {$scope: $scope});

    $scope.id = $routeParams.id;
    
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