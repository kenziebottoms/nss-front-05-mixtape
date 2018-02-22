"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").controller("FavoritesCtrl", function($scope, SubscriptionFactory, SpotifyAuthFactory, LinkFactory) {
    // TODO: grab media cards and user avatars for favorites, sort by recently interacted with
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
            return SubscriptionFactory.getSubscriptionsByUid($scope.user.id);
        })
        .then(results => {
            let subs = Object.values(results);
            let loadedSubPromises = subs.map(sub => {
                if (sub.media) {
                    return LinkFactory.loadMedia(sub);
                } else {
                    return LinkFactory.loadMusic(sub);
                }
            });
            return Promise.all(loadedSubPromises);
        })
        .then(loadedSubs => {
            $scope.media = _.filter(loadedSubs, "media");
            $scope.music = _.filter(loadedSubs, "music");
        })
        .catch(err => {
            console.log(err);
            // Materialize.toast(err, 3000, "pink accent-2");
        });
});