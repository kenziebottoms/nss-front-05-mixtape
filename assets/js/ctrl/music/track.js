"use strict";

angular.module("mixtape").controller("TrackCtrl", function($scope, $q, $routeParams, $controller, SpotifyTrackFactory, FirebaseFactory) {
    $controller("MusicCtrl", {$scope: $scope});
    
    $scope.id = $routeParams.id;
    $scope.typeId = `track:${$scope.id}`;

    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            SpotifyTrackFactory.getTrackById($scope.id)
                .then(track => {
                    $scope.music = SpotifyTrackFactory.parseApiInfo(track);
                    FirebaseFactory.storeMusic($scope.typeId, $scope.music);
                    resolve();
                });
        });
    };

    $scope.fetchInfo();
    Promise.all([
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ])
        .then(response => {
            $scope.getVotes();
        });
});