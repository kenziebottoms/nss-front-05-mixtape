"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, $controller, $q, FirebaseFactory, LinkFactory, $routeParams, SpotifyAuthFactory) {

    // gets voting, deletion, playback methods from LinkCardCtrl
    $controller("LinkCardCtrl", {$scope: $scope});
    
    // promises user data on profile owner
    let getOwnerData = () => {
        return $q((resolve, reject) => {
            FirebaseFactory.getUserData($scope.profileUser.id)
                .then(userData => {
                    $scope.profileUser = userData;
                    resolve();
                });
        });
    };

    // promises list of 5 most recent loaded links by this user
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

    $scope.profileUser = {id: $routeParams.id };
    getOwnerData();

    // after links and user data have been fetched, get votes
    Promise.all([
        $scope.getLinks(),
        $scope.getUserData()
    ])
        .then(response => {
            $scope.getVotes();
        });
});