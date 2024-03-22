'use strict';
const data = require('../tables/posts');
const migrations = require('../migrations');
module.exports = migrations.createAndDrop(data);