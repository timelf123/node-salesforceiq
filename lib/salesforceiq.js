/*
 * Original code from: https://github.com/sjlu/node-SalesforceIQLib
 * Original code license: MIT
 */

'use strict';

var request = require('request');
var _ = require('lodash');

var SalesforceIQLib = (function() {

  var url = 'https://api.salesforceiq.com/v2/';

  function SalesforceIQLib(apiKey, apiSecret) {
    request = request.defaults({
      auth: {
        user: apiKey,
        pass: apiSecret,
        sendImmediately: true
      }
    });
  }

  var makeRequest = function(uri, data, cb) {
    /* Set defaults and set the
     * api user and secret key
     * as the request's basic auth
     */
    data = data || {};
    data.method = data.method || 'GET';

    request(url + uri, data, function(err, httpReq, body) {
      if (err) { return cb(err); }

      switch (httpReq.statusCode) {
        case 200:
        case 204: {
          break;
        }
        case 400: {
          // REF console.log('err = ', err);
          // REF console.log('body = ', body);
          return cb(new Error('bad request'));
        }
        case 401: {
          return cb(new Error('unauthorized'));
        }
        case 403: {
          return cb(new Error('forbidden'));
        }
        case 404: {
          return cb(new Error('not found'));
        }
        case 422: {
          return cb(new Error('unprocessable entity'));
        }
        case 429: {
          return cb(new Error('too many requests'));
        }
        case 500: {
          // REF console.log('body = ', body);
          return cb(new Error('internal server error'));
        }
        case 503: {
          return cb(new Error('service unavailable'));
        }
        default: {
          return cb(new Error('unrecognized http status code: ' +
            httpReq.statusCode));
        }
      }

      try {
        if ('string' === typeof body) {
          body = JSON.parse(body);
        }
      } catch (e) {
        return cb(new Error('unreadable data'));
      }

      if (body && body.objects) {
        body = body.objects;
      }

      cb(err, body);
    });
  };

  SalesforceIQLib.prototype.getAccounts = function(cb) {
    makeRequest('accounts', {}, cb);
  };

  SalesforceIQLib.prototype.getAccount = function(accountId, cb) {
    makeRequest('accounts/' + accountId, {}, cb);
  };

  SalesforceIQLib.prototype.getAccountFields = function(cb) {
    makeRequest('accounts/fields', {}, cb);
  };

  SalesforceIQLib.prototype.createAccount = function(account, cb) {
    if (!account.name) { return cb(new Error('Name is required')); }
    account = _.pick(account, ['name', 'fieldValues']);

    makeRequest('accounts', {
      method: 'POST',
      json: account
    }, cb);
  };

  SalesforceIQLib.prototype.createContact = function(contact, cb) {
    if (!contact.name) { return cb(new Error('Name is required')); }

    contact = _.pick(contact, [
      'name',
      'email',
      'phone',
      'address',
      'company',
      'title'
    ]);

    _.each(contact, function(values, key) {
      if (Array.isArray(values)) {
        values = _.map(values, function(value) {
          return {
            value: value
          };
        });
      } else if ('string' === typeof values) {
        values = [{
          value: values
        }];
      } else {
        return; // Unrecognized
      }

      contact[key] = values;
    });

    makeRequest('contacts', {
      method: 'POST',
      json: {
        properties: contact
      }
    }, cb);
  };

  SalesforceIQLib.prototype.getContactByEmail = function(email, cb) {
    makeRequest('contacts?properties.email=' + email, {}, cb);
  };

  SalesforceIQLib.prototype.updateContact = function(contact, cb) {
    makeRequest('contacts/' + contact.id, {
      method: 'PUT',
      json: contact
    }, cb);
  };

  SalesforceIQLib.prototype.getContacts = function(cb) {
    makeRequest('contacts', {}, cb);
  };

  SalesforceIQLib.prototype.getContact = function(contactid, cb) {
    makeRequest('contacts/' + contactid, {}, cb);
  };

  SalesforceIQLib.prototype.getContactByEmail = function(email, cb) {
    makeRequest('contacts?properties.email=' + email, {}, cb);
  };

  SalesforceIQLib.prototype.getUser = function(userid, cb) {
    makeRequest('users/' + userid, {}, cb);
  };


  SalesforceIQLib.prototype.getLists = function(cb) {
    makeRequest('lists?_start=0&_limit=50', {}, cb);
  };

  SalesforceIQLib.prototype.getListItems = function(listId, queryString,cb) {
    makeRequest('lists/' + listId + '/listitems?' + queryString, {}, cb);
  };

  SalesforceIQLib.prototype.getList = function(listId, cb) {
    makeRequest('lists/' + listId, {}, cb);
  };

  SalesforceIQLib.prototype.getListItem = function(listId, listItemId, cb) {
    makeRequest('lists/' + listId + '/listitems/' + listItemId, {}, cb);
  };

  SalesforceIQLib.prototype.getListItemsByContactId =
    function(listId, contactIds, cb) {
      contactIds = [].concat(contactIds);
      makeRequest('lists/' + listId + '/listitems?contactIds=' +
        contactIds.join(','), {}, cb);
    };

  SalesforceIQLib.prototype.createListItem = function(listId, listItem, cb) {
    if (!listItem.accountId && !listItem.contactIds) {
      return cb(new Error('accountId or contactIds is required'));
    }
    listItem = _.pick(listItem, [
      'accountId',
      'listId',
      'contactIds',
      'name',
      'fieldValues',
      'fields',
      'linkedItemIds'
    ]);
    var req = {
      method: 'POST',
      json: listItem
    };
    // REF console.log('making request, listItem %j', listItem);
    // REF console.log('URL: lists/' + listId + '/listitems');

    makeRequest('lists/' + listId + '/listitems', req, cb);
  };

  SalesforceIQLib.prototype.updateListItem =
    function(listId, listItemId, listItem, cb) {
      var req = {
        method: 'PUT',
        json: listItem
      };
      makeRequest('lists/' + listId + '/listitems/' + listItemId, req, cb);
    };

  SalesforceIQLib.prototype.removeListItem = function(listId, listItemId, cb) {
    var req = {
      method: 'DELETE'
    };
    makeRequest('lists/' + listId + '/listitems/' + listItemId, req, cb);
  };

  SalesforceIQLib.prototype.createEvent = function(body, cb) {
    var req = {
      method: 'PUT',
      json: body
    };
    makeRequest('events/', req, cb);
  };

  // NJC this does not work.  IQ has 'archive' in UI not in API
  SalesforceIQLib.prototype.deleteContact = function(contactid, cb) {
    var req = {
      method: 'DELETE'
    };
    makeRequest('contacts/' + contactid, req, cb);
  };


  SalesforceIQLib.prototype.deleteAccount = function(accountid, cb) {
    var req = {
      method: 'DELETE'
    };
    makeRequest('accounts/' + accountid, req, cb);
  };

  return SalesforceIQLib;

})();

module.exports = SalesforceIQLib;
