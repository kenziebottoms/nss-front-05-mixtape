"use strict";

const convert = require('xml-js');
const angular = require("angular");

angular.module("mixtape").factory("GoodreadsFactory", function($q, $http, GOODREADS) {

    // promises a given book's details
    let getBookById = id => {
        return $q((resolve, reject) => {
            $http.get(`${GOODREADS.url}/book/show/${id}?key=${GOODREADS.key}`)
                .then(({data}) => {
                    // convert XML to JSON
                    data = JSON.parse(convert.xml2json(data, {compact: true}));
                    // shave down JSON
                    data = data.GoodreadsResponse.book;
                    resolve(data);
                });
        });
    };

    // promises search results by title
    let searchByTitle = term => {
        return $q((resolve, reject) => {
            $http.get(`${GOODREADS.url}/search/index.xml?key=${GOODREADS.key}&q=${term}`)
                .then(({data}) => {
                    data = JSON.parse(convert.xml2json(data, {compact: true}));
                    resolve(data.GoodreadsResponse.search);
                })
                .catch(err => reject(err));
        });
    };

    // hacks the goodreads images paths to get a large image instead of a medium image
    let getLargeImage = mediumImgUrl => {
        let mediumPath = mediumImgUrl.split("/")[4];
        let largePath = mediumPath.replace("m", "l");
        return mediumImgUrl.replace(mediumPath, largePath);
    };

    // takes raw data from an API call and returns Firebase-formatted data
    let parseApiInfo = data => {
        if (!data.title._cdata) {
            data.title._cdata = data.title._text;
        }
        if (data.authors.author.length > 1) {
            data.authors.author = data.authors.author[0];
        }
        let book = {
            subtitle: data.authors.author.name._text,
            small_image: data.image_url._text,
            image: getLargeImage(data.image_url._text),
            title: data.title._cdata,
            id: data.id._text
        };
        return(book);
    };

    return { getBookById, getLargeImage, parseApiInfo, searchByTitle };
});