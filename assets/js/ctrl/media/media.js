"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $routeParams, $q, $location, LinkFactory, SpotifyAuthFactory, VoteFactory) {
    
    $scope.getLinks = (typeId) => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMedia(typeId)        
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
                    $scope.context = "media";
                    resolve();
                });
        });
    };

    $scope.getUserData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getActiveUserData()
                .then(data => {
                    $scope.user = data;
                    resolve();
                })
                .catch(err => $location.path("/"));
        });
    };

    $scope.getVotes = () => {
        let linkVotePromises = $scope.links.filter(link => {
            return link.uid != $scope.user.id;
        }).map(link => {
            return VoteFactory.loadVote(link, $scope.user.id);
        });
    };

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
        let link = $scope.links.find(link => link.key == linkId);
        if (link.vote == 1) {
            VoteFactory.unvote(linkId, $scope.user.id)
                .then(response => link.vote = 0);
        } else {
            VoteFactory.upvote(linkId, $scope.user.id)
                .then(response => link.vote = 1);
        }
    };

    $scope.downvote = linkId => {
        let link = $scope.links.find(link => link.key == linkId);
        if (link.vote == -1) {
            VoteFactory.unvote(linkId, $scope.user.id)
                .then(response => link.vote = 0);
        } else {
            VoteFactory.downvote(linkId, $scope.user.id)
                .then(response => link.vote = -1);
        }
    };
});