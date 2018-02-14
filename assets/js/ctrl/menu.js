"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MenuCtrl", function($scope, $rootScope, SPOTIFY, SpotifyAuthFactory) {
    $scope.key = SPOTIFY.key;
    
    let getUserData = () => {
        $scope.menu = [];
        SpotifyAuthFactory.getActiveUserData()
            .then(userData => {
                $scope.user = userData;
                $scope.menu.push({
                    url: "#!/new",
                    label: "New Mix",
                    show: "user"
                });
            })
            .catch(err => $scope.user = null);
    };

    getUserData();
    
    $scope.$on('userChange', (event, user) => {
        $scope.user = user;
    });

    $scope.logout = () => {
        $scope.user = null;
        SpotifyAuthFactory.logout();
        $rootScope.$broadcast('userChange', null);
    };
});