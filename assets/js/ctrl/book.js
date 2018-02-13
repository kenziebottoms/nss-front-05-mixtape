"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory, FirebaseFactory, $controller) {

    $controller("MediaCtrl", {$scope: $scope});

    // get book details
    $scope.fetchInfo = () => {
        GoodreadsFactory.getBookById($scope.id)
            .then(book => {
                // update cached info in Firebase
                book = GoodreadsFactory.parseApiInfo(book);
                // pass book to dom            
                $scope.media = book;
                
                FirebaseFactory.cacheMedia($scope.typeId, book);
            });
    };

    $scope.typeId = `book:${$scope.id}`;
    $scope.fetchInfo($scope.typeId);
    $scope.getLinks($scope.typeId);
});