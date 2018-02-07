"use strict";

const angular = require("angular");
angular.module("mixtape").factory("GoodreadsFactory", function($q, $http, GOODREADS) {

    // returns book details about given book
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

    // takes raw data from an API call and returns Firebase-formatted data
    const parseApiInfo = data => {
        let book = {
            year: data.publication_year._text,
            image: getLargeImage(data.image_url._text),
            title: data.title._cdata
        };
        return(book);
    };

    return { getBookById, getLargeImage, parseApiInfo };
});