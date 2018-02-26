"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, $q, $controller, GoodreadsFactory, FirebaseFactory) {

    // gets link loading methods from MediaCtrl
    $controller("MediaCtrl", {$scope: $scope});

    // get book details straight from Goodreads
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            GoodreadsFactory.getBookById($scope.id)
                .then(data => {
                    // clean up data for display and storage
                    let book = GoodreadsFactory.parseApiInfo(data);
                    // pass book to dom
                    $scope.media = book;
                    $scope.media.summary = data.description._cdata.split("<br")[0];
                    resolve();
                    // update cached info in Firebase
                    FirebaseFactory.cacheMedia($scope.typeId, book);
                });
        });
    };

    $scope.typeId = `book:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);
    
    // after links and user data have been fetched, get votes
    Promise.all([
        $scope.getLinks($scope.typeId),
        $scope.getUserData()
            .then(response => {
                $scope.isSubscribed();
            })
    ])
        .then(results => {
            $scope.getVotes();
        });
});