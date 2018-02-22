"use strict";

const angular = require("angular");

angular.module("mixtape").controller("FavoritesCtrl", function($scope, SubscriptionFactory, SpotifyAuthFactory) {
    // TODO: grab media cards and user avatars for favorites, sort by recently interacted with
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
            return SubscriptionFactory.getSubscriptionsByUid($scope.user.id);
        })
        .then(results => {
            $scope.subs = results;
        })
        .catch(err => {
            Materialize.toast(err, 3000, "pink accent-2");
        });
});