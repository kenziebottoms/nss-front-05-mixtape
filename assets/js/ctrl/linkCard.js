"use strict";

const angular = require("angular");

angular.module("mixtape").controller("LinkCardCtrl", function($scope, $q, $location, LinkFactory, VoteFactory, SpotifyAuthFactory, SpotifyPlaybackFactory) {

    // asynchronously updates $scope.user
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

    // loads links with votes
    // ASSUMPTION: $scope.links has been initialized and set
    $scope.getVotes = () => {
        $scope.links.filter(link => {
            return link.uid != $scope.user.id;
        }).map(link => {
            return VoteFactory.loadVote(link, $scope.user.id);
        });
    };

    // deletes the given link and refreshes the list of links on the page
    $scope.deleteLink = key => {
        LinkFactory.deleteLink(key)
            .then(result => {
                $scope.getLinks();
            })
            .catch(err => {
                Materialize.toast(err, 3000, "pink accent-2");
            });
    };
    
    // upvotes the current link if not already upvoted
    $scope.upvote = linkId => {
        let link = $scope.links.find(link => link.key == linkId);
        if (link.vote == 1) {
            VoteFactory.unvote(linkId, $scope.user.id)
                .then(response => {
                    link.score = link.score - link.vote;
                    link.vote = 0;
                });
        } else {
            VoteFactory.upvote(linkId, $scope.user.id)
                .then(response => {
                    link.score = link.score - link.vote + 1;
                    link.vote = 1;
                });
        }
    };

    // downvotes the current link if not already downvoted
    $scope.downvote = linkId => {
        let link = $scope.links.find(link => link.key == linkId);
        if (link.vote == -1) {
            VoteFactory.unvote(linkId, $scope.user.id)
                .then(response => {
                    link.score = link.score - link.vote;
                    link.vote = 0;
                });
        } else {
            VoteFactory.downvote(linkId, $scope.user.id)
                .then(response => {
                    link.score = link.score - link.vote - 1;
                    link.vote = -1;
                });
        }
    };
    
    // plays the given track or playlist
    $scope.play = (uid, music) => {
        if (music.type == 'playlist') {
            $scope.playPlaylist(uid, music.id);
        } else if (music.type == 'track') {
            $scope.playTrack(music.id);
        }
    };
    
    // turns shuffle off and plays the given playlist
    $scope.playPlaylist = (uid, id) => {
        SpotifyPlaybackFactory.turnOffShuffle()
            .then( response => {
                SpotifyPlaybackFactory.playPlaylist(uid, id);
            });
    };

    // turns shuffle off and plays the given track
    $scope.playTrack = id => {
        SpotifyPlaybackFactory.turnOffShuffle()
            .then(response => {
                SpotifyPlaybackFactory.playTrack(id);
            });
    };
});