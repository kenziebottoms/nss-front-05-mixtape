"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, FirebaseFactory, LinkFactory, $routeParams, SpotifyAuthFactory, VoteFactory) {
    $scope.profileUser = {id: $routeParams.id };
    
    FirebaseFactory.getUserData($scope.profileUser.id)
        .then(userData => {
            $scope.profileUser = userData;
        });

    Promise.all([
        LinkFactory.getLinksByUid($scope.profileUser.id, 5)
            .then(data => {
                $scope.links = data;
                $scope.context = "profile";
            }),
        SpotifyAuthFactory.getActiveUserData()
            .then(userData => {
                $scope.user = userData;
            })
    ])
        .then(response => {
            $scope.links.filter(link => {
                return link.uid != $scope.user.id;
            }).map(link => {
                return VoteFactory.loadVote(link, $scope.user.id);
            });
        });

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