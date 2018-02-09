"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, SPOTIFY, SpotifyAuthFactory, UserFactory) {

    $scope.menu = [];
    $scope.user = UserFactory;
    SpotifyAuthFactory.getActiveUserData()
        .then(userData => {
            UserFactory = userData;
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