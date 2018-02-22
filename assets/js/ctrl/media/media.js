"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MediaCtrl", function($scope, $controller, $routeParams, $q, LinkFactory, VoteFactory, SubscriptionFactory) {
    
    // gets voting, deletion, playback methods from LinkCardCtrl
    $controller("LinkCardCtrl", {$scope: $scope});

    $scope.id = $routeParams.id;
    
    // promises list of all loaded links connected to this piece of media
    $scope.getLinks = () => {
        return $q((resolve, reject) => {
            LinkFactory.getLinksByMedia($scope.typeId)
                .then(links => {
                    $scope.links = links;
                    $scope.context = "media";
                    resolve();
                });
        });
    };

    // subscribe to media then update $scope.subscription accordingly
    $scope.subscribe = () => {
        SubscriptionFactory.subscribeMedia($scope.typeId, $scope.user.id)
            .then(data => {
                $scope.subscription = {key: data.name};
            })
            .catch(err => {
                Materialize.toast(err, 3000, "pink accent-2");
            });
    };

    // updates $scope.subscription according to Firebase
    $scope.isSubscribed = () => {
        SubscriptionFactory.isSubscribedMedia($scope.typeId, $scope.user.id)
            .then(sub => {
                $scope.subscription = sub;
            })
            .catch(err => {
                $scope.subsription = false;
            });
    };

});