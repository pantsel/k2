require('../styles/importer.less')
require("vue-awesome-notifications/dist/styles/style.css")
require('bootstrap-vue/dist/bootstrap-vue.css');


window.io = require('../dependencies/sails.io');
window.$ = require('jquery');
require('bootstrap');
window.parasails = require('../dependencies/parasails')

// Cloud & cloud setup
window.Cloud = require('../dependencies/cloud')
require('./cloud.setup')

import Vue from "vue"
import VueAWN from "vue-awesome-notifications"
import BootstrapVue from 'bootstrap-vue'

Vue.use(VueAWN)
Vue.use(BootstrapVue)



function requireAll(r) { r.keys().forEach(r); }


requireAll(require.context('./components/', true, /\.js$/));
requireAll(require.context('./utilities/', true, /\.js$/));
requireAll(require.context('./pages/', true, /\.js$/));


