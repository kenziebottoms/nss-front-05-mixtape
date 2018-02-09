"use strict";

const angular = require("angular");

angular.module("mixtape").factory("UserFactory", function($q, $http) {
    return {
        user: null
    };
});