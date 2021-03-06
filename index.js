var through = require('through2');
var gutil = require('gulp-util');
var dgram = require('dgram');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-docker-notify';

function sendNotification(messageString) {
  const message = Buffer.from(messageString);
  const client = dgram.createSocket('udp4');
  client.send(message, 9090, 'docker.for.mac.localhost', (err) => {
    client.close();
  });
}

function gulpDockerNotify(title, information, error) {

  if (!title) {
    throw new PluginError(PLUGIN_NAME, 'Missing title!');
  }

  if (information == 'undefined') {
    var information = ""
  }

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    var message = {
      "title": gutil.template(title, {file: file}),
      "information": gutil.template(information, {file: file}),
      "error": false
    }

    sendNotification(JSON.stringify(message));

    cb(null, file);
  });

}

// Exporting the plugin main function
module.exports = gulpDockerNotify;
