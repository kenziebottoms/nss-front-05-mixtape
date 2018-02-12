"use strict";

const angular = require("angular");

angular.module("mixtape").controller("TvCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory, $location, SpotifyAuthFactory) {

    let fetchInfo = (typeId) => {
        TmdbFactory.getTvShowById($scope.id)
        .then(show => {
            // update cached info in firebase
            show = TmdbFactory.parseApiInfo("tv", show);
            // pass data to dom
            $scope.media = show;
            FirebaseFactory.cacheMedia(typeId, show);
        });
    };

    let getLinks = (typeId) => {
        LinkFactory.getLinksByMedia(typeId)
            .then(loadedLinks => {
                $scope.links = loadedLinks;
                $scope.context = "media";
            });
    };

    SpotifyAuthFactory.getActiveUserData().then(data => {
        $scope.user = data;
    });
    $scope.id = $routeParams.id;
    let typeId = `tv:${$scope.id}`;
    
    fetchInfo(typeId);
    getLinks(typeId);

    $scope.deleteLink = key => {
        LinkFactory.deleteLink(key)
            .then(result => {
                getLinks(typeId);
            })
            .catch(err => {
                Materialize.toast(err, 3000);
            });
    };
});