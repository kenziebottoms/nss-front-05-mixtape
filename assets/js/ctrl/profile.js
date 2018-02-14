"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, $controller, $q, FirebaseFactory, LinkFactory, $routeParams, SpotifyAuthFactory, VoteFactory) {

    $controller("LinkCardCtrl", {$scope: $scope});
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
                })
                .catch(resolve(null));
        });
    };

    $scope.getLinks = () => {
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
        $scope.getLinks(),
        getUserData()
    ])
        .then(response => {
            $scope.getVotes();
        });
});