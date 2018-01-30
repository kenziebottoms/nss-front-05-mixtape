"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyUserFactory", function($q, $http, spotify) {
    // asks spotify for user info using the current token
    const getActiveUserInfo = token => {
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: `${spotify.url}/me`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(userInfo => {
                    resolve(userInfo);
                })
                .catch(err => reject(err));
        });
    };

    const getActiveToken = () => {
        let token = localStorage.getItem("spotifyUserToken");
        let expiration = localStorage.getItem("spotifyTokenExpiration");
        if (expiration < parseInt(Date.now()/1000)) {
            logOut();
            return false;
        } else {
            return token;
        }
    };

    // stores user token and its expiration date in localStorage
    // receives:    user token, maximum age thereof in seconds
    // returns:     nothing
    const setActiveToken = (token, expires_in) => {
        localStorage.setItem("spotifyUserToken", token);
        // Date.now() returns epoch in milliseconds, we want seconds
        let timeStamp = parseInt(Date.now()/1000);
        localStorage.setItem("spotifyTokenExpiration", (+timeStamp) + (+expires_in));
    };

    // parses spotify callback hash and logs user in
    // receives:    spotify callback hash
    // returns: nothing
    const logIn = hash => {
        let hashes = hash.split(/[?&]/);
        let token = hashes[0].split(/=/)[1];
        let expires_in = hashes[2].split(/=/)[1];
        setActiveToken(token, expires_in);
    };

    const logOut = () => {
        localStorage.removeItem("spotifyUserToken");
        localStorage.removeItem("spotifyTokenExpiration");
        localStorage.removeItem("spotifyUserInfo");
    };

    const cacheUserData = data => {
        localStorage.setItem("spotifyUserInfo", JSON.stringify(data));
    };

    const getUserData = () => {
        return $q((resolve, reject) => {
            let userData = localStorage.getItem("spotifyUserInfo");
            if (userData) {
                resolve(JSON.parse(userData));
            } else {
                let token = getActiveToken();
                if (token) {
                    getActiveUserInfo(token).then((data) => {
                        cacheUserData(data);
                        resolve(JSON.parse(data));
                    }).catch(err => console.log("failed to getActiveUserInfo", err));
                } else {
                    reject("no token");
                }
            }
        });
    };

    return { logIn, logOut, getActiveToken, getUserData };

});