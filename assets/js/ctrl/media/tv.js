"use strict";

angular.module("mixtape").controller("TvCtrl", function($scope, $q, $controller, TmdbFactory, TMDB, FirebaseFactory) {

    $controller("MediaCtrl", {$scope: $scope});    

    $scope.fetchInfo = (typeId) => {
        return $q((resolve, reject) => {
            TmdbFactory.getTvShowById($scope.id)
                .then(show => {
                    // update cached info in firebase
                    show = TmdbFactory.parseApiInfo("tv", show);
                    // pass data to dom
                    $scope.media = show;
                    resolve();
                    FirebaseFactory.cacheMedia(typeId, show);
                });
        });
    };

    $scope.typeId = `tv:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);

    let promises = [
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
    ];
    Promise.all(promises)
        .then(results => {
            $scope.getVotes();
        });
});