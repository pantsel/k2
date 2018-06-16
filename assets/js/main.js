require('../styles/importer.less')



var io = require('../dependencies/sails.io');
window.$ = require('jquery');
window.parasails = require('../dependencies/parasails')
window.Cloud = require('../dependencies/cloud')
require('./cloud.setup')



// To make the socket client available globally, uncomment the next line:
window.io = io;
// window._ = _;
// window.$ = window.jQuery = $;
// window.bowser = bowser;
// window.Vue = Vue;
// window.parasails = parasails;
// window.Cloud = Cloud;

function requireAll(r) { r.keys().forEach(r); }

requireAll(require.context('./components/', true, /\.js$/));
requireAll(require.context('./utilities/', true, /\.js$/));

requireAll(require.context('./pages/', true, /\.js$/));


