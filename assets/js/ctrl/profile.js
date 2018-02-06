"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, SpotifyAuthFactory) {
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
        });
});