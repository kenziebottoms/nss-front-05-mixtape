"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyAuthFactory) {

    $scope.menu = [];
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            $scope.user = userData;
            $scope.menu.push({
                url: "#!/new",
                label: "New Mix",
                show: "authenticated"
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