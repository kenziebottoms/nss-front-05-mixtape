"use strict";

angular.module("mixtape").controller("HomeCtrl", function($scope, LinkFactory) {
    LinkFactory.getRecentLinks(20)
        .then(links => {
            $scope.links = links;
        });
});