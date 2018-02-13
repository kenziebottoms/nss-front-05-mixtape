"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, $q, $controller, GoodreadsFactory, GOODREADS, FirebaseFactory) {

    $controller("MediaCtrl", {$scope: $scope});

    // get book details
    $scope.fetchInfo = () => {
        return $q((resolve, reject) => {
            GoodreadsFactory.getBookById($scope.id)
                .then(book => {
                    // update cached info in Firebase
                    book = GoodreadsFactory.parseApiInfo(book);
                    // pass book to dom            
                    $scope.media = book;
                    resolve();
                    FirebaseFactory.cacheMedia($scope.typeId, book);
                });
        });
    };

    $scope.typeId = `book:${$scope.id}`;
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