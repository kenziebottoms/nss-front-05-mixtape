"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $routeParams, $q, LinkFactory, SpotifyAuthFactory, VoteFactory) {
    
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
                });
        });
    };

    $scope.getVotes = () => {
        let linkVotePromises = $scope.links.filter(link => {
            return link.uid != $scope.user.id;
        });
        linkVotePromises = linkVotePromises.map(link => {
            VoteFactory.getVote(link.key, $scope.user.id)
                .then(vote => {
                    $scope.links = $scope.links.map(link => {
                        if (link.uid != $scope.user.id) {
                            link.vote = vote;
                        }
                        return link;
                    });
                });
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
        // TODO: remove downvote, if any
        VoteFactory.upvote(linkId, $scope.user.id);
    };

    $scope.downvote = linkId => {
        // TODO: remove downvote, if any
        VoteFactory.downvote(linkId, $scope.user.id);
    };
});