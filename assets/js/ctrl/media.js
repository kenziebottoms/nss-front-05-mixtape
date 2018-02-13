"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory, SpotifyAuthFactory) {
    
    $scope.getLinks = (typeId) => {
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

    $scope.deleteLink = key => {
        LinkFactory.deleteLink(key)
            .then(result => {
                $scope.getLinks($scope.typeId);
            })
            .catch(err => {
                Materialize.toast(err, 3000);
            });
    };
});