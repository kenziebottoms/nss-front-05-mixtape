"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").controller("FavoritesCtrl", function($scope, SubscriptionFactory, SpotifyAuthFactory, LinkFactory) {
    // get user data before proceeding
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
            // get active user's faves/subscriptions
            return SubscriptionFactory.getSubscriptionsByUid($scope.user.id);
        })
        .then(results => {
            let subs = Object.values(results);
            // load subscriptions with music/media
            let loadedSubPromises = subs.map(sub => {
                if (sub.media) {
                    return LinkFactory.loadMedia(sub);
                } else {
                    return LinkFactory.loadMusic(sub);
                }
            });
            return Promise.all(loadedSubPromises);
        })
        // once they're all done, filter them
        // TODO: sort by freshness
        .then(loadedSubs => {
            $scope.media = _.filter(loadedSubs, "media");
            $scope.music = _.filter(loadedSubs, "music");
        })
        .catch(err => {
            Materialize.toast(err, 3000, "pink accent-2");
        });
});