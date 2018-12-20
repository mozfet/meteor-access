import Access from './access'

/**
 * Recursively transfer a component and decendants to a user.
 * Component ownership is validated before transferring.
 * @param {string} collectionName - the name of the collection containing the
 * document
 * @param {string} documentId - the id of the document to transfer ownership of
 * @param {string} userId - the user id of the new owner
 * @throws {Meteor.Error} for access denied and not found
 */
const transferOwnership = (collectionName, documentId, userId) => {
  if (_.isUndefined(documentId || !_.isString(userId))) {
    Log.log(['error', 'access'], 'invalid document id')
  }

  if (_.isUndefined(userId) || !_.isString(userId)) {
    Log.log(['error', 'access'], 'invalid user id')
  }

  // get the collection
  const collection = Mongo.Collection.get(collectionName)

  // fetch document
  const doc = collection.findOne(documentId)
  Log.log(['debug', 'access'], 'transferOwnership.document:', doc)

  // error checks
  if (_.isUndefined(doc)) {
    Log.log(['error', 'access'], 'cannot find document '+documentId+
      ' in collection '+collectionName)
  }
  if(!Access.isUser(userId)) {
    Log.log(['error', 'access'], 'cannot find user '+userId)
  }

  // if user is owner of doc or is admin
  if (Access.isOwner(undefined, doc) || Access.isAdmin()) {

    // update component doc owner
    collection.update(doc._id, {$set: {ownerId: userId}})

    const children = collection.find({ownerId: doc.ownerId, parentId: doc._id})
    Log.log(['debug', 'access'], 'transferOwnership.children:',
        children.count())

    // for each child
    children.forEach((child) => {
      Log.log(['debug', 'access'], 'transferOwnership.child:', child)

      // recurse
      transferOwnership(child._id, userId);
    })
  }

  //else
  else {

    //log and throw error
    Log.log(['error', 'access'], 'access denied to user '+Meteor.userId());
  }
}

export default {
  transferOwnership: transferOwnership
}
