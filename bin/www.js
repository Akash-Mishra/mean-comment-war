// #! /usr/bin/env node

var debug = require('debug')('comment-war');
var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	debug('Magic Mike on port ' + server.address().port);
});