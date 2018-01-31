"use strict";

const angular = require("angular");

angular.module("mixtape").controller("SpotifyUserCtrl", function($scope, SpotifyUserFactory) {
    SpotifyUserFactory.getUserData().then(data => {
        $scope.user = data;
    }).catch(err => console.log(err));
});