"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyUserFactory", function($q, $http, spotify) {
    // asks spotify for user info using the current token
    // receives:    token
    // returns:     promise of userData
    const fetchUserInfo = token => {
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: `${spotify.url}/me`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    cacheUserData(data);
                    resolve(data);
                })
                .catch(err => reject(err));
        });
    };

    // retrieves active token and checks that it's still valid
    // receieves:   nothing
    // returns:     token | false
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
    // returns:     nothing
    const logIn = hash => {
        let hashes = hash.split(/[?&]/);
        let token = hashes[0].split(/=/)[1];
        let expires_in = hashes[2].split(/=/)[1];
        setActiveToken(token, expires_in);
        return getUserData();
    };
    // removes all localStorage variables related to the user
    // recieves:    nothing
    // returns:     nothing
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
            let token = getActiveToken();
            if (userData) {
                resolve(JSON.parse(userData));
            } else if (token) {
                return fetchUserInfo(token);
            } else {
                reject("No active user");
            }
        });
    };

    return { logIn, logOut, getActiveToken, getUserData };

});