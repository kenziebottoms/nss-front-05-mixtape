"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, $q, $controller, GoodreadsFactory, FirebaseFactory) {

    // gets link loading methods from MediaCtrl
    $controller("MediaCtrl", {$scope: $scope});

    // get book details straight from Goodreads
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            GoodreadsFactory.getBookById($scope.id)
                .then(book => {
                    // clean up data for display and storage
                    book = GoodreadsFactory.parseApiInfo(book);
                    // pass book to dom
                    $scope.media = book;
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
    ])
        .then(results => {
            $scope.getVotes();
        });
});