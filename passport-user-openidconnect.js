'use strict'

let util = require('util')
let OpenIDConnectStrategy = require('passport-openidconnect').Strategy;

function Strategy(options, verify) { 
  OpenIDConnectStrategy.call(this, options, verify);

  this.name = 'user-oidc';
}

/**
 * Inherit from `OpenIDConnectStrategy`.
 */
util.inherits(Strategy, OpenIDConnectStrategy);

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;