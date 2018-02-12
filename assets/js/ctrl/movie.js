"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MovieCtrl", function($scope, TmdbFactory, $routeParams, TMDB, LinkFactory, FirebaseFactory) {
    let fetchInfo = (typeId) => {
        LinkFactory.getLinksByMedia(typeId)        
            .then(loadedLinks => {
                $scope.links = loadedLinks;
                $scope.context = "media";
            });
    };
    let getLinks = typeId => {
        TmdbFactory.getMovieById($scope.id)
            .then(movie => {
                // update cached info in Firebase
                movie =  TmdbFactory.parseApiInfo("movie", movie);
                FirebaseFactory.storeMedia(typeId, movie);

                // pass data to dom
                $scope.media = movie;
            });
    };

    $scope.id = $routeParams.id;
    let typeId = `movie:${$scope.id}`;
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