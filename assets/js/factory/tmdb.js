"use strict";

const angular = require("angular");

angular.module("mixtape").factory("TmdbFactory", function($q, $http, TMDB) {
    let searchMoviesByTitle = title => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/search/movie?api_key=${TMDB.key}&query=${title}`)
                .then(({data}) => resolve(data));
        });
    };
    let searchTvShowsByTitle = title => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/search/tv?api_key=${TMDB.key}&query=${title}`)
                .then(({data}) => resolve(data));
        });
    };
    let getMovieById = id => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/movie/${id}?api_key=${TMDB.key}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };
    let getTvShowById = id => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/tv/${id}?api_key=${TMDB.key}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // takes raw data from an API call and returns data ready for Firebase
    let parseApiInfo = (type, data) => {
        let media = {};
        if (type == "movie") {
            media = {
                image: TMDB.image_prefix+data.poster_path,
                small_image: TMDB.small_image_prefix+data.poster_path,
                title: data.title,
                subtitle: data.release_date.slice(0,4),
                id: data.id
            };
        } else {
            media = {
                image: TMDB.image_prefix+data.poster_path,
                small_image: TMDB.small_image_prefix+data.poster_path,
                title: data.name,
                subtitle: data.first_air_date.slice(0,4),
                id: data.id
            };
        }
        return media;
    };

    return {searchMoviesByTitle, searchTvShowsByTitle, getMovieById, getTvShowById, parseApiInfo};
});