'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  version:'"dev_0.1"',
  servicePath :'"http://localhost:9090/rhea/"',
  fileSysPath :'"http://localhost:9090/fileManagerw/"',
  chatServicePath :'"http://localhost:9090/chatw/"'
  
})
