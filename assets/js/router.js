"use strict";

const angular = require("angular");
const myApp = angular.module("mixtape");

myApp.config($routeProvider => {
    $routeProvider
        .when("/search/:term", {
            templateUrl: "assets/partials/search.html",
            controller: "SearchCtrl"
        })
        .when("/", {
            templateUrl: "assets/partials/home.html",
            controller: "HomeCtrl"
        })
        .when("/user/:id", {
            templateUrl: "assets/partials/profile.html",
            controller: "ProfileCtrl"
        })
        .when("/movie/:id", {
            templateUrl: "assets/partials/media.html",
            controller: "MovieCtrl"
        })
        .when("/tv/:id", {
            templateUrl: "assets/partials/media.html",
            controller: "TvCtrl"
        })
        .when("/book/:id", {
            templateUrl: "assets/partials/media.html",
            controller: "BookCtrl"
        })
        .when("/new", {
            templateUrl: "assets/partials/link.html",
            controller: "LinkCtrl"
        })
        .when("/track/:id", {
            templateUrl: "assets/partials/track.html",
            controller: "TrackCtrl"
        })
        .when("/link/:id", {
            templateUrl: "assets/partials/link.html",
            controller: "LinkCtrl"
        });
});