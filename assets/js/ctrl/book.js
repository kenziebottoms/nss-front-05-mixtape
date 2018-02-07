"use strict";

const angular = require("angular");
const convert = require('xml-js');

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory, FirebaseFactory) {
    $scope.id = $routeParams.id;
    // get book details
    GoodreadsFactory.getBookById($scope.id)
        .then(data => {
            // convert XML to JSON
            data = JSON.parse(convert.xml2json(data, {compact: true}));
            // shave down JSON
            let book = data.GoodreadsResponse.book;

            // update cached info in Firebase
            FirebaseFactory.cacheInfo(`book:${$scope.id}`, GoodreadsFactory.parseApiInfo(book));
            
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