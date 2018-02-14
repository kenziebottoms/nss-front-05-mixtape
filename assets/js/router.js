"use strict";

angular.module("mixtape").config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "assets/partials/home.html"
        })
        .state("userProfile", {
            url: "/user/:id",
            templateUrl: "assets/partials/profile.html",
            controller: "ProfileCtrl"
        });
    $urlRouterProvider.otherwise("/");
    // $routeProvider
    //     .when("/", {
    //         templateUrl: "assets/partials/home.html",
    //         controller: "HomeCtrl"
    //     })
    //     .when("/user/:uid/playlist/:id", {
    //         templateUrl: "assets/partials/playlist.html",
    //         controller: "PlaylistCtrl"
    //     })
    //     .when("/user/:id", {
    //         templateUrl: "assets/partials/profile.html",
    //         controller: "ProfileCtrl"
    //     })
    //     .when("/movie/:id", {
    //         templateUrl: "assets/partials/media.html",
    //         controller: "MovieCtrl"
    //     })
    //     .when("/tv/:id", {
    //         templateUrl: "assets/partials/media.html",
    //         controller: "TvCtrl"
    //     })
    //     .when("/book/:id", {
    //         templateUrl: "assets/partials/media.html",
    //         controller: "BookCtrl"
    //     })
    //     .when("/new", {
    //         templateUrl: "assets/partials/link.html",
    //         controller: "LinkCtrl"
    //     })
    //     .when("/track/:id", {
    //         templateUrl: "assets/partials/track.html",
    //         controller: "TrackCtrl"
    //     })
    //     .when("/link/:id", {
    //         templateUrl: "assets/partials/link.html",
    //         controller: "LinkCtrl"
    //     });
});