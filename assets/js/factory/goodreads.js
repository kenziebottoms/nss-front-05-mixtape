"use strict";

const angular = require("angular");
angular.module("mixtape").factory("GoodreadsFactory", function($q, $http, GOODREADS) {
    const getBookById = id => {
        return $q((resolve, reject) => {
            $http.get(`${GOODREADS.url}/book/show/${id}?key=${GOODREADS.key}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // hacks the goodreads images paths to get a large image instead of a medium image
    const getLargeImage = mediumImgUrl => {
        let mediumPath = mediumImgUrl.split("/")[4];
        let largePath = mediumPath.replace("m", "l");
        return mediumImgUrl.replace(mediumPath, largePath);
    };

    return { getBookById, getLargeImage };
});