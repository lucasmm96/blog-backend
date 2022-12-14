const expect = require('chai').expect;
const jToken = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth')

describe('Auth middleware', function() {
  it('should throw an error when authorization header is not present', () => {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
  });

  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
        return 'xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('it should return a userId after decoding the token', () => {
    const req = {
      get: function(headerName) {
        return 'Bearer xyz';
      }
    };
    sinon.stub(jToken, 'verify');
    jToken.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jToken.verify.called).to.be.true;
    jToken.verify.restore();
  });

  it('should throw an error when the token cannot be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
