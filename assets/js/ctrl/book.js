"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    // get book details
    GoodreadsFactory.getBookById($scope.id)
        .then(book => {
            // update cached info in Firebase
            FirebaseFactory.cacheInfo(`book:${$scope.id}`, GoodreadsFactory.parseApiInfo(book));

            // displays large image instead of medium
            book.image_url._text = GoodreadsFactory.getLargeImage(book.image_url._text);
            
            // pass book to dom
            $scope.book = book;
            
            // fetch relevant links
            let typeId = `book:${$scope.id}`;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            // pass links to dom
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});