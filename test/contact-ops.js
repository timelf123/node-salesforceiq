'use strict';

var SalesforceIQ = require('../index.js');

var util = require('util');
var assert = require('assert');
var uid = require('uid');
var _ = require('lodash');

var apiKey = process.env['SALESFORCEIQ_KEY'];
var apiSecret = process.env['SALESFORCEIQ_SECRET'];

describe('SalesforceIQ Contact Operations', function() {
  var salesforceIQ = new SalesforceIQ(apiKey, apiSecret);
  var accountId = null;
  var companyName = 'Test - Sigma Software';
  var contactName = 'User Leslie';
  var contactEmail = 'leslie@test.sigmasofware.com';
  var contactId = null;
  var listPeopleId = null;
  var listLicensesId = null;
  var listLicensesItem = null;
  var listLicensesItemId = null;
  var listAccountzId = null;
  var listAccountzItemId = null;

  /* SKIPPING AS API DOES NOT HAVE ABILITY TO DELETE AFTER CREATING */
  it.skip('should create a contact', function(done) {
    salesforceIQ.createContact({
      name: contactName,
      company: companyName,
      email: contactEmail
    }, function(err, data) {
      assert.ifError(err);
      // REF print(err, data);

      assert.ok(data.id);
      assert.equal(_.first(data.properties.email).value, contactEmail);

      contactId = data.id;
      console.log(contactEmail + ' -> contactId = ', contactId);

      done();
    });
  });

  it.skip('should retrieve a contact via an email address', function(done) {
    salesforceIQ.getContactByEmail(contactEmail, function(err, data) {
      assert.ifError(err);
      // REF print(err, data);

      assert.ok(data[0].id);
      assert.equal(data[0].properties.email[0].value, contactEmail);

      contactId = data[0].id;
      console.log(contactEmail + ' -> contactId = ', contactId);

      done();
    });
  });

  it.skip('should delete a contact', function(done) {
    // NJC this does not work.  IQ has 'archive' in UI not in API
    salesforceIQ.deleteContact(contactId, function(err, data) {
      assert.ifError(err);
      // REF print(err, data);

      done();
    });
  });  
});
