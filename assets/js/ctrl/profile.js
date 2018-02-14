"use strict";

angular.module("mixtape").controller("ProfileCtrl", function($scope, $q, FirebaseFactory, LinkFactory, $routeParams, SpotifyAuthFactory, VoteFactory) {
    $scope.profileUser = {id: $routeParams.id };
    
    let getOwnerData = () => {
        return $q((resolve, reject) => {
            FirebaseFactory.getUserData($scope.profileUser.id)
                .then(userData => {
                    $scope.profileUser = userData;
                    resolve();
                });
        });
    };
    let getUserData = () => {
        return $q((resolve, reject) => {
            SpotifyAuthFactory.getActiveUserData()
                .then(userData => {
                    $scope.user = userData;
                    resolve();
                });
        });
        
    };

    let getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByUid($scope.profileUser.id, 5)
                .then(data => {
                    $scope.links = data;
                    $scope.context = "profile";
                    resolve();
                });
        });
        
    };

    getOwnerData();
    Promise.all([
        getLinks(),
        getUserData()
    ])
        .then(response => {
            $scope.links.filter(link => {
                return link.uid != $scope.user.id;
            }).map(link => {
                return VoteFactory.loadVote(link, $scope.user.id);
            });
        });

    $scope.deleteLink = key => {
        LinkFactory.deleteLink(key)
            .then(result => {
                getLinks();
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