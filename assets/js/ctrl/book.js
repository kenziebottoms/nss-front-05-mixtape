"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    let typeId = `book:${$scope.id}`;
    // get book details
    GoodreadsFactory.getBookById($scope.id)
        .then(book => {
            // update cached info in Firebase
            book = GoodreadsFactory.parseApiInfo(book);
            FirebaseFactory.storeMedia(typeId, book);

            // pass book to dom            
            $scope.media = book;
        });
    LinkFactory.getLinksByMedia(typeId)
        .then(loadedLinks => {
            // pass links to dom
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});