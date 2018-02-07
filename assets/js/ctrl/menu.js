"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyAuthFactory) {
    $scope.token = SpotifyAuthFactory.getActiveToken();
    $scope.menu = [];
    if (!$scope.token) {
        $scope.key = SPOTIFY.key;
    } else {
        $scope.menu.push({
            url: "#!/new",
            label: "New Mix"
        });
    }

    $scope.logout = () => {
        $scope.login = true;
        $scope.logout = false;
        SpotifyAuthFactory.logout();
    };
});