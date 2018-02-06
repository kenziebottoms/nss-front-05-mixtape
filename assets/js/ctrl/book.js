"use strict";

const angular = require("angular");
const convert = require('xml-js');

angular.module("mixtape").controller("BookCtrl", function($scope, GoodreadsFactory, $routeParams, GOODREADS, LinkFactory) {
    $scope.id = $routeParams.id;
    GoodreadsFactory.getBookById($scope.id)
        .then(data => {
            data = JSON.parse(convert.xml2json(data, {compact: true}));
            let book = data.GoodreadsResponse.book;
            book.image_url._text = GoodreadsFactory.getLargeImage(book.image_url._text);
            $scope.book = book;
            let typeId = `book:${$scope.id}`;
            return LinkFactory.getLinksByMedia(typeId);
        })
        .then(loadedLinks => {
            $scope.links = loadedLinks;
            $scope.context = "media";
        });
});