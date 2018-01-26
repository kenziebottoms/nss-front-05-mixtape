"use strict";

const angular = require("angular");
const myApp = angular.module("mixtape");

myApp.controller("MenuCtrl", function($scope, SpotifyFactory) {
    const key = require("../keys").spotify_public;
    $scope.menu = {
        "Login": `https://accounts.spotify.com/authorize?client_id=${key}&redirect_uri=http:%2F%2Flocalhost:8080%2Fcallback&scope=user-top-read%20user-read-currently-playing&response_type=token`
    };
    console.log($scope);
});