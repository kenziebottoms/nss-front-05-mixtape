"use strict";

const angular = require("angular");
const ngRoute = require("angular-route");

let myApp = angular.module("mixtape", [ngRoute]);

require("./router.js");
require("./constants.js");

require("./ctrl/menu");
require("./ctrl/user");
require("./ctrl/home");
require("./ctrl/search");
require("./ctrl/profile");

require("./factory/spotifyAuth");
require("./factory/spotifySearch");
require("./factory/media");
require("./factory/link");