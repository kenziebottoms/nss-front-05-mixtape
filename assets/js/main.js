"use strict";

const angular = require("angular");
const ngRoute = require("angular-route");

let myApp = angular.module("mixtape", [ngRoute]);

require("./router.js");
require("./constants.js");

require("./ctrl/menu");
require("./ctrl/spotifyUser");
require("./ctrl/home");
require("./ctrl/search");

require("./factory/spotifyUser");
require("./factory/spotifySearch");