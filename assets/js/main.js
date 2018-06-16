require('../styles/importer.less')


window.io = require('../dependencies/sails.io');
window.$ = require('jquery');
require('bootstrap');
window.parasails = require('../dependencies/parasails')

// Cloud & cloud setup
window.Cloud = require('../dependencies/cloud')
require('./cloud.setup')



function requireAll(r) { r.keys().forEach(r); }


requireAll(require.context('./components/', true, /\.js$/));
requireAll(require.context('./utilities/', true, /\.js$/));
requireAll(require.context('./pages/', true, /\.js$/));


