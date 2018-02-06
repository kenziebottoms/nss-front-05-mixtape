"use strict";

const angular = require("angular");

angular.module("mixtape").controller("ProfileCtrl", function($scope, FirebaseFactory, LinkFactory, $routeParams) {
    FirebaseFactory.getUserData($routeParams.id)
        .then(({data}) => {
            $scope.user = data;
            return LinkFactory.getLinksByUid($scope.user.username);
        })
        .then(data => {
            $scope.links = data;
            $scope.context = "profile";
        });
});