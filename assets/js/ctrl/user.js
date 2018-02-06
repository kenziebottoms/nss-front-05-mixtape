"use strict";

const angular = require("angular");

angular.module("mixtape").controller("UserCtrl", function($scope, SpotifyAuthFactory, $location, $window) {
    let hash = $location.hash();
    if (hash) {
        SpotifyAuthFactory.login(hash).then(userData => {
            $scope.user = userData;
            $location.hash("");
        });
    } else {
        SpotifyAuthFactory.getActiveUserData().then(data => {
            $scope.user = data;
            $scope.profile_link = `#!/user/${data.uri.split(":")[2]}`;
        }).catch(err => console.log(err));
    }

    $scope.logout = () => {
        $scope.user = null;
        SpotifyAuthFactory.logout();
        $scope.login = true;
    };
});