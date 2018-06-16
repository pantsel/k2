require('../styles/importer.less')
require("vue-awesome-notifications/dist/styles/style.css")


window.io = require('../dependencies/sails.io');
window.$ = require('jquery');
require('bootstrap');
window.parasails = require('../dependencies/parasails')

// Cloud & cloud setup
window.Cloud = require('../dependencies/cloud')
require('./cloud.setup')

import Vue from "vue"
import VueAWN from "vue-awesome-notifications"

Vue.use(VueAWN)



function requireAll(r) { r.keys().forEach(r); }


requireAll(require.context('./components/', true, /\.js$/));
requireAll(require.context('./utilities/', true, /\.js$/));
requireAll(require.context('./pages/', true, /\.js$/));


