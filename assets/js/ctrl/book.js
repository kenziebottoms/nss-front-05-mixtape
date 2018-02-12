"use strict";

const angular = require("angular");

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory, FirebaseFactory) {

    // get book details
    let fetchInfo = (typeId) => {
        GoodreadsFactory.getBookById($scope.id)
            .then(book => {
                // update cached info in Firebase
                book = GoodreadsFactory.parseApiInfo(book);
                FirebaseFactory.storeMedia(typeId, book);

                // pass book to dom            
                $scope.media = book;
            });
    };

    let getLinks = typeId => {
        LinkFactory.getLinksByMedia(typeId)
            .then(loadedLinks => {
                // pass links to dom
                $scope.links = loadedLinks;
                $scope.context = "media";
            });
    };

    $scope.id = $routeParams.id;
    let typeId = `book:${$scope.id}`;
    fetchInfo(typeId);
    getLinks(typeId);

    $scope.deleteLink = key => {
        LinkFactory.deleteLink(key)
            .then(result => {
            })
            .catch(err => {
                Materialize.toast(err, 3000);
            });
    };
});