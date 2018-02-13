"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $routeParams, LinkFactory, SpotifyAuthFactory, VoteFactory) {
    
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

    $scope.upvote = linkId => {
        // TODO: remove downvote, if any
        VoteFactory.upvote(linkId, $scope.user.id);
    };
});