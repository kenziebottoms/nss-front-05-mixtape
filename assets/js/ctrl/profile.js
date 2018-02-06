"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, SpotifyAuthFactory, LinkFactory) {
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
            return LinkFactory.getLinksByUid($scope.user.username);
        })
        .then(data => {
            $scope.links = data;
        });
});