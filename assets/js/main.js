"use strict";

const angular = require("angular");
const ngRoute = require("angular-route");

let myApp = angular.module("mixtape", [ngRoute]);

require("./router.js");

require("./ctrl/menu");
require("./ctrl/spotifySearchTrack");

require("./factory/spotifySearch");