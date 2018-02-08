"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    // get book details
    GoodreadsFactory.getBookById($scope.id)
        .then(book => {
            let typeId = `book:${$scope.id}`;
            // update cached info in Firebase
            book = GoodreadsFactory.parseApiInfo(book);
            FirebaseFactory.cacheInfo(typeId, book);

            // pass book to dom            
            $scope.media = book;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            // pass links to dom
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});