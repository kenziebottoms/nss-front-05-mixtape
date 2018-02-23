"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyAuthFactory", function($q, $http, SPOTIFY, FirebaseFactory, $rootScope) {

    // promises active user info from Spotify through current token
    let fetchUserInfo = token => {
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/me`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    // stores data in localStorage so we don't have to do this again
                    cacheUserData(data);
                    resolve(data);
                })
                .catch(err => reject(err));
        });
    };

    // retrieves active token and checks that it's still valid
    let getActiveToken = () => {
        let token = localStorage.getItem("spotifyUserToken");
        let expiration = localStorage.getItem("spotifyTokenExpiration");
        if (expiration < parseInt(Date.now()/1000)) {
            logout();
            return false;
        } else {
            return token;
        }
    };

    // stores user token and its expiration date in localStorage
    let setActiveToken = (token, expires_in) => {
        localStorage.setItem("spotifyUserToken", token);
        let timeStamp = parseInt(Date.now()/1000);
        localStorage.setItem("spotifyTokenExpiration", (+timeStamp) + (+expires_in));
    };

    // parses spotify callback hash and stores token
    let login = hash => {
        let hashes = hash.split(/[?&]/);
        let token = hashes[0].split(/=/)[1];
        let expires_in = hashes[2].split(/=/)[1];
        setActiveToken(token, expires_in);
        return getActiveUserData();
    };

    // clears localStorage
    let logout = () => {
        localStorage.removeItem("spotifyUserToken");
        localStorage.removeItem("spotifyTokenExpiration");
        localStorage.removeItem("spotifyUserInfo");
        $rootScope.$broadcast('userChange', null);
    };

    // promises user data for given user
    let getUserData = username => {
        return $q((resolve, reject) => {
            let token = getActiveToken();
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/users/${username}`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // stores user data in localStorage and Firebase
    let cacheUserData = data => {
        data.username = data.uri.split(":")[2].replace(".",",");
        localStorage.setItem("spotifyUserInfo", JSON.stringify(data));
        FirebaseFactory.storeUserData(data.username, data);
    };

    // promises active user data, checked for in localStorage before fetched from Spotify
    let getActiveUserData = () => {
        return $q((resolve, reject) => {
            let userData = localStorage.getItem("spotifyUserInfo");
            let token = getActiveToken();
            if (userData) {
                resolve(JSON.parse(userData));
            } else if (token) {
                resolve(fetchUserInfo(token));
            } else {
                reject("No active user");
            }
        });
    };

    return { login, logout, getActiveToken, getActiveUserData, getUserData };
});