"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyAuthFactory) {

    $scope.menu = [];
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
            $scope.menu.push({
                url: "#!/new",
                label: "New Mix"
            });
            $scope.authenticated = true;
        })
        .catch(err => {
            $scope.key = SPOTIFY.key;
            $scope.authenticated = false;
        });

    $scope.logout = () => {
        $scope.user = null;
        SpotifyAuthFactory.logout();
        $scope.authenticated = false;
    };
});