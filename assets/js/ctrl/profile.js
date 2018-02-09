"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, FirebaseFactory, LinkFactory, $routeParams) {
    FirebaseFactory.getUserData($routeParams.id)
        .then(userData => {
            $scope.user = userData;
            return LinkFactory.getLinksByUid($scope.user.id, 5);
        })
        .then(data => {
            $scope.links = data;
            $scope.context = "profile";
        });
});