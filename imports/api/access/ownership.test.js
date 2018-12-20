/* jshint esversion: 6 */
import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import Sinon from 'sinon';
import '../../test/collections';
import { Log } from 'meteor/mozfet:meteor-logs';
import Access from './access';
import Ownership from './ownership';

if (Meteor.isServer) {
  describe('Access.Ownership', function () {

    beforeEach(function () {
      //stub Log
      Sinon.stub(Log, 'log').callsFake(function (tags, msg, data) {
        const args = data?[msg, data]:[msg];
        let isError = _.contains(tags, 'error');
        if (isError) {/*console.error(...args);*/ throw new Meteor.Error(msg);}

        let isInfo = _.contains(tags, 'info');
        if (isInfo) {/*console.info(...args);*/}

        let isAccess = _.contains(tags, 'access');
        let isDebug = _.contains(tags, 'debug');
        if (isDebug && isAccess) {/*console.log(...args);*/}
      });
      resetDatabase();
      Meteor._sleepForMs(50);
    });

    afterEach(function () {
      Log.log.restore();
      resetDatabase();
      Meteor._sleepForMs(50);
    });

    it('should transfer by owner', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      Ownership.transferOwnership('Components', '9876', '8888');
      const result = Components.findOne('9876').ownerId;
      const expectedResult = '8888';
      chai.assert.equal(result, expectedResult, 'owner should have changed');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should transfer by admin', function () {
      Sinon.stub(Meteor, 'userId').returns('5555');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(true);
      Sinon.stub(Access, 'isOwner').returns(false);

      Components.insert({_id: '9876', ownerId: '1234'});

      Ownership.transferOwnership('Components', '9876', '8888');
      const result = Components.findOne('9876').ownerId;
      const expectedResult = '8888';
      chai.assert.equal(result, expectedResult, 'owner should have changed');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer for others', function () {
      Sinon.stub(Meteor, 'userId').returns('5555');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(false);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', '9876', '8888');
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer undefined document id', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', undefined, '8888');
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');


      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer to non string document id', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', 9876, '8888');
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer to non existing documemt', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', '6789', '8888');
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer to undefined user', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', '9876', undefined);
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer to non string user', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(true);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', '9876', 8888);
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });

    it('should not transfer to non existing user', function () {
      Sinon.stub(Meteor, 'userId').returns('1234');
      Sinon.stub(Access, 'isUser').returns(false);
      Sinon.stub(Access, 'isAdmin').returns(false);
      Sinon.stub(Access, 'isOwner').returns(true);

      Components.insert({_id: '9876', ownerId: '1234'});

      let result = false;
      try {
        Ownership.transferOwnership('Components', '9876', '8888');
      } catch (e) {
        result = true;
      }
      const expectedResult = true;
      chai.assert.equal(result, expectedResult, 'should throw exception');

      Meteor.userId.restore();
      Access.isUser.restore();
      Access.isAdmin.restore();
      Access.isOwner.restore();
    });
  });
}
