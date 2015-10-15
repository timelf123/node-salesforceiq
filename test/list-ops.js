'use strict';

var SalesforceIQ = require('../index.js');

var util = require('util');
var assert = require('assert');
var uid = require('uid');
var _ = require('lodash');

var apiKey = process.env['SALESFORCEIQ_KEY'];
var apiSecret = process.env['SALESFORCEIQ_SECRET'];

describe('SalesforceIQ List Operations', function() {
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

  it.skip('should get a list', function(done) {
    // REF console.log('------------------ getLists ----------------------');
    salesforceIQ.getLists(function(err, data) {
      assert.ifError(err);
      // REF print(err, data);

      _.forEach(data, function(list) {
        // REF console.log(list.title);
        if (list.title === 'Licenses') {
          // REF print(err, data);
          listLicensesId = list.id;
        } else if (list.title === 'Accountz') {
          listAccountzId = list.id;
        } else if (list.title === 'People') {
          listPeopleId = list.id;
        }
      });

      console.log('listLicensesId = ', listLicensesId);
      console.log('listAccountzId = ', listAccountzId);
      console.log('listPeopleId = ', listPeopleId);

      assert.ok(listAccountzId);

      done();
    });
  });

  it.skip('should create a list item for Accountz', function(done) {
    salesforceIQ.createListItem(listAccountzId, {
      accountId: accountId,
      contactIds: [
        contactId
      ]
    }, function(err, data) {
      console.log('err = ', err);
      assert.ifError(err);
      // REF print(err, data);

      assert.ok(data.id);
      assert.equal(data.contactIds[0], contactId);

      listAccountzItemId = data.id;
      console.log('listAccountzItemId = ', listAccountzItemId);

      done();
    });
  });

  it.skip('should get a list of items in Licenses', function(done) {
    var queryString = '_start=0&_limit=5';

    salesforceIQ.getListItems(listLicensesId, queryString, function(err, data) {
      assert.ifError(err);
      // REF console.log('LIST OF LICENSES');
      // REF print(err, data);

      assert.ok(data[0].id);

      done();
    });
  });

  it.skip('should create a list item for Licenses', function(done) {
    var query = {};

    query.contactIds = [contactId];

    query.fieldValues = {
      10: [ { raw: accountId } ]
    };

    query.linkedItemIds = {};

    query.linkedItemIds['list.' + listAccountzId] = [ { itemId: accountId } ];

    console.log(util.inspect(query, false, null));
    // REF console.log('---------------------------------------------------');

    salesforceIQ.createListItem(listLicensesId, query, function(err, data) {
      // REF console.log('err = ', err);
      // REF console.log(util.inspect(data, false, null));
      assert.ifError(err);
      // REF print(err, data);

      assert.ok(data.id);
      assert.equal(data.contactIds[0], contactId);

      listLicensesItemId = data.id;

      done();
    });
  });

  it.skip('should fetch a list item by contactId', function(done) {
    salesforceIQ.getListItemsByContactId(listLicensesId, contactId,
      function(err, listItems) {
        assert.ifError(err);
        // REF print(err, listItems);

        assert.ok(listItems);
        assert.equal(listItems.length, 1);
        assert.equal(listItems[0].id, listLicensesItemId);

        done();
      }
    );
  });


  it.skip('should obtain a list item', function(done) {
    // REF console.log('--------------------- getListItem -------------------');
    salesforceIQ.getListItem(listLicensesId, listLicensesItemId,
      function(err, data) {
        assert.ifError(err);
        // REF print(err, data);

        assert.ok(data.id);

        listLicensesItem = data;


        done();
      }
    );
  });

  it.skip('should get a list of items in Licenses by modified 1 minute ago',
    function(done) {
      console.log('--------------------- getListItem: 1 minute ago----------');

      var oneMinuteAgo = ((new Date()).getTime() - 60000);

      var queryString = '_start=0&_limit=5&modifiedDate=' + oneMinuteAgo;

      console.log('oneMinuteAgo = ', oneMinuteAgo);
      console.log('queryString = ', queryString);

      salesforceIQ.getListItems(listLicensesId, queryString,
        function(err, data) {
          assert.ifError(err);
          console.log('LIST OF LICENSES');
          print(err, data);

          //assert.ok(data[0].id);

          done();
        }
      );
    }
  );

  it.skip('should properly update a list item', function(done) {
    console.log('--------------------- updateListItem -------------------');
    listLicensesItem.name = uid(20);

    listLicensesItem.fieldValues['10'] =
     [ { raw: '561c20c9e4b015855217662f' } ];

    listLicensesItem.linkedItemIds =
      { 'list.561c14e9e4b0158552173e14':
        [ { itemId: '561c20c9e4b015855217662f' } ]
      };

    console.log('listLicensesItem = %j', listLicensesItem);

    salesforceIQ.updateListItem(listLicensesId,
      listLicensesItem.id, listLicensesItem,

      function(err, data) {
        assert.ifError(err);
        print(err, data);

        assert.ok(data.id);
        // REF assert.equal(data.name, listItem.name);

        console.log(data);

        done();
      }
    );
  });

  /* Cleanup */

  it.skip('should remove a list item in Accountz', function(done) {
    salesforceIQ.removeListItem(listAccountzId,
      listAccountzItemId, function(err, data) {
      assert.ifError(err);
      // REF: print(err, data);

      done();
    });
  });

  it.skip('should remove a list item in Licenses', function(done) {
    salesforceIQ.removeListItem(listLicensesId,
      listLicensesItemId, function(err, data) {
      assert.ifError(err);
      // REF: print(err, data);

      done();
    });
  });

});
