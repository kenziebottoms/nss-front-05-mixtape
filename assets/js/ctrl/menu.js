"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, spotify) {
    $scope.menu = {
        "Login": `https://accounts.spotify.com/authorize?client_id=${spotify.key}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&scope=user-top-read%20user-read-currently-playing&response_type=token`
    };
});