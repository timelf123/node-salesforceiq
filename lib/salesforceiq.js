/**
 * SalesforceIQ
 * @see  https://github.com/Illumineto/node-salesforceiq
 * Original code from: https://github.com/sjlu/node-relateiq
 * Original code license: MIT
 */

'use strict';

var request = require('request');
var _ = require('lodash');

var SalesforceIQ = (function() {

  var url = 'https://api.salesforceiq.com/v2/';

  function SalesforceIQ(apiKey, apiSecret) {
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

  // API Methods
  // Accounts

  /**
   * Get the account entity fields metadata
   * @param  {Function} cb Callback
   */
  SalesforceIQ.prototype.getAccountFields = function(cb) {
    makeRequest('accounts/fields', {}, cb);
  };

  /**
   * Create a new account in SalesforceIQ
   * @param  {Object}   account The account to be created
   * @param  {Function} cb      Callback
   */
  SalesforceIQ.prototype.createAccount = function(account, cb) {
    if (!account.name) { return cb(new Error('Name is required')); }
    account = _.pick(account, ['name', 'fieldValues']);

    makeRequest('accounts', {
      method: 'POST',
      json: account
    }, cb);
  };

  /**
   * Get all accounts from SalesforceIQ
   * @param  {Function} cb Callback
   */
  SalesforceIQ.prototype.getAccounts = function(cb) {
    makeRequest('accounts', {}, cb);
  };

  /**
   * Get an account from SalesforceIQ by ID
   * @param  {string}   accountId The SalesforceIQ ID to lookup
   * @param  {Function} cb        Callback
   */
  SalesforceIQ.prototype.getAccount = function(accountId, cb) {
    makeRequest('accounts/' + accountId, {}, cb);
  };

  /**
   * Update an account in SalesforceIQ by ID
   * @param  {string}   accountId The SalesforceIQ ID of the account to update
   * @param  {Object}   account The account object to update SalesforceIQ with
   * @param  {Function} cb      Callback
   */
  SalesforceIQ.prototype.updateAccount = function(accountId, account, cb) {
    if (!account.name) { return cb(new Error('Name is required')); }
    account = _.pick(account, ['name', 'fieldValues']);

    makeRequest('accounts', {
      method: 'POST',
      json: account
    }, cb);
  };

  SalesforceIQ.prototype.deleteAccount = function(accountid, cb) {
    var req = {
      method: 'DELETE'
    };
    makeRequest('accounts/' + accountid, req, cb);
  };

  SalesforceIQ.prototype.createContact = function(contact, cb) {
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

  SalesforceIQ.prototype.getContactByEmail = function(email, cb) {
    makeRequest('contacts?properties.email=' + email, {}, cb);
  };

  SalesforceIQ.prototype.updateContact = function(contact, cb) {
    makeRequest('contacts/' + contact.id, {
      method: 'PUT',
      json: contact
    }, cb);
  };

  SalesforceIQ.prototype.getContacts = function(cb) {
    makeRequest('contacts', {}, cb);
  };

  SalesforceIQ.prototype.getContact = function(contactid, cb) {
    makeRequest('contacts/' + contactid, {}, cb);
  };

  SalesforceIQ.prototype.getContactByEmail = function(email, cb) {
    makeRequest('contacts?properties.email=' + email, {}, cb);
  };

  SalesforceIQ.prototype.getUser = function(userid, cb) {
    makeRequest('users/' + userid, {}, cb);
  };


  SalesforceIQ.prototype.getLists = function(cb) {
    makeRequest('lists?_start=0&_limit=50', {}, cb);
  };

  SalesforceIQ.prototype.getListItems = function(listId, queryString,cb) {
    makeRequest('lists/' + listId + '/listitems?' + queryString, {}, cb);
  };

  SalesforceIQ.prototype.getList = function(listId, cb) {
    makeRequest('lists/' + listId, {}, cb);
  };

  SalesforceIQ.prototype.getListItem = function(listId, listItemId, cb) {
    makeRequest('lists/' + listId + '/listitems/' + listItemId, {}, cb);
  };

  SalesforceIQ.prototype.getListItemsByContactId =
    function(listId, contactIds, cb) {
      contactIds = [].concat(contactIds);
      makeRequest('lists/' + listId + '/listitems?contactIds=' +
        contactIds.join(','), {}, cb);
    };

  SalesforceIQ.prototype.createListItem = function(listId, listItem, cb) {
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

  SalesforceIQ.prototype.updateListItem =
    function(listId, listItemId, listItem, cb) {
      var req = {
        method: 'PUT',
        json: listItem
      };
      makeRequest('lists/' + listId + '/listitems/' + listItemId, req, cb);
    };

  SalesforceIQ.prototype.removeListItem = function(listId, listItemId, cb) {
    var req = {
      method: 'DELETE'
    };
    makeRequest('lists/' + listId + '/listitems/' + listItemId, req, cb);
  };

  SalesforceIQ.prototype.createEvent = function(body, cb) {
    var req = {
      method: 'PUT',
      json: body
    };
    makeRequest('events/', req, cb);
  };

  // NJC this does not work.  IQ has 'archive' in UI not in API
  SalesforceIQ.prototype.deleteContact = function(contactid, cb) {
    var req = {
      method: 'DELETE'
    };
    makeRequest('contacts/' + contactid, req, cb);
  };



  return SalesforceIQ;

})();

module.exports = SalesforceIQ;
