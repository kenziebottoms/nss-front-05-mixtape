"use strict";

const angular = require("angular");

angular.module("mixtape").controller("NewLinkCtrl", function($scope) {
    $scope.setActive = mediaType => {
        $scope.active = mediaType;
    };

    $scope.isActive = mediaType => {
        if ($scope.active == mediaType) {
            return "active";
        } else {
            return "";
        }
    };
});