"use strict";

const angular = require("angular");

angular.module("mixtape").controller("HomeCtrl", function($scope, $routeParams, $location, LinkFactory) {
    LinkFactory.getRecentLinks(20)
        .then(links => {
            $scope.links = links;
        });
});