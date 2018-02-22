"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MusicCtrl", function($scope, $q, $controller, LinkFactory, SubscriptionFactory) {
    
    // gets voting, deletion, playback methods from LinkCardCtrl
    $controller("LinkCardCtrl", {$scope: $scope});

    // promises list of all loaded links connected to this piece of music
    $scope.getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMusic($scope.typeId)
                .then(loadedLinks => {
                    $scope.links = loadedLinks;
                    resolve();
                });
        });
    };

    // subscribe to media then update $scope.subscription accordingly
    $scope.subscribe = () => {
        SubscriptionFactory.subscribeMusic($scope.typeId, $scope.user.id)
            .then(data => {
                $scope.subscription = {key: data.name};
            })
            .catch(err => {
                Materialize.toast(err, 3000, "pink accent-2");
            });
    };

    // updates $scope.subscription according to Firebase
    $scope.isSubscribed = () => {
        SubscriptionFactory.isSubscribedMusic($scope.typeId, $scope.user.id)
            .then(sub => {
                $scope.subscription = sub;
            })
            .catch(err => {
                $scope.subsription = false;
            });
    };

});