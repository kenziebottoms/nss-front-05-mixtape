"use strict";

const angular = require("angular");

angular.module("mixtape").controller("HomeCtrl", function($scope, $routeParams, LinkFactory) {
    // fetch 20 most recent links
    LinkFactory.getRecentLinks(20)
        .then(links => {
            $scope.links = links;
        })
        .catch(err => {
            $scope.links = {};
            Materialize.toast("No results. :(", 3000, "pink accent-2");
            console.log(err);
        });
});