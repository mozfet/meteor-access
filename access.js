import { _ } from 'meteor/underscore'
import Guest from './guest'

/**
 * Returns true of user is admin. If no id is provided the current meteor user
 * is assumed.
 * @param {String} userId - optional id of user to check for admin rights
 * @returns {Boolean} true if user is admin
 **/
const isAdmin = (userId) => {
  const id = userId?userId:Meteor.userId()
  return Roles.userIsInRole(id, ['admin'])
}

/**
 * Determine ownership of a document
 * @param {string} userId - the owners who's ownership is being validated
 * @param {object} doc - the document being validated
 */
const isOwner = (userId, doc) => {
  const id = userId?userId:Meteor.userId()
  return doc && (doc.ownerId === id)
}

/**
 * Determine if a userId is valid or if it is available
 * @param {string} userId - the id of the user
 * @return {boolean} true of user exists
 */
const isUser = (userId) => {
  const id = userId?userId:Meteor.userId()
  user = Meteor.users.findOne(id, {fields: {}})
  return user?true:false
}

/**
 * Determine if user is handler of a document
 * @param {}  -
 * @returns {}
 **/
 const isHandler = (userId, doc) => {
   const id = userId?userId:Meteor.userId()
   return doc && doc.handlers && doc.handlers.includes(id)
 }

/**
 * Get an human friendly label for a user.
 * Preferably username or email.
 * @param {string|object} userOrId - the user or id of the user
 */
const userLabel = (user) => {

  // normalize user
  user = normaliseUser(user)
  if (!user) {
    return 'Anonymous'
  }

  // normalize name
  let name
  if (user.profile) {
    const profile = user.profile
    const firstName = profile.firstname?profile.firstname.trim():''
    const lastName = profile.lastname?profile.lastname.trim():''
    name = (firstName+' '+lastName).trim()
  }
  const username = user.username?user.username.trim():''

  // return label based on preference
  if (username && (username.length > 0)) {
    return username
  }
  else if (name && (name.length > 0)) {
    return name
  }
  else {
    const email = userEmail(user)
    return email
  }
}

/**
 * Find a user by email
 * @param {}  -
 * @returns {}
 **/
const findUserByEmail = email => {
  const user = Meteor.users.findOne({$or: [
    {'emails.address': email},
    {'services.biocryptology.email': email}
  ]})
  Log.log(['debug', 'access'], `Found user for ${email}:`, user)
  return user
}

/**
 * Normalise a user and throws exception if not found
 * @param {String|Object} user - the user or id of the user
 * @returns {Object} user
 * @throws {Meteor.Error}
 **/
const normaliseUser = (user) => {
  if (_.isUndefined(user)) {
    Log.log(['error', 'access'],'Cannot find email for undefined user.')
  }
  if (_.isString(user)) {
    const _user = Meteor.users.findOne(user)
    if (_.isUndefined(_user)) {
      Log.log(['error', 'access'],`Cannot find email for unknown user ${user}.`)
    }
    return _user
  }
  return user
}

/**
 * Get user email
 * @param {String|Object} user - user id or document
 * @returns {String} primary email of user
 **/
const userEmail = (user) => {
  user = normaliseUser(user)
  const usernamePasswordEmail = user.emails?user.emails[0].address:undefined
  const biocryptologyEmail =
      user.services&&
      user.services.biocryptology&&
      user.services.biocryptology.email?
      user.services.biocryptology.email:undefined
  const email = usernamePasswordEmail||biocryptologyEmail
  return email
}

/**
 * Checks if email is verified
 * @param {}  -
 * @returns {}
 **/

const isUserEmailVerified = (user, email) => {
  user = normaliseUser(user)

  // if username password account
  if (user.emails) {

    // find email
    const userEmail = _.find(user.emails, userEmail => {
      return userEmail.address === email
    })

    // if user email is verified
    if (userEmail && userEmail.verified) {

      // return true
      return true
    }
  }

  // if biocryptology account
  if (user.services && user.services.biocryptology &&
      user.services.biocryptology.email) {

    // assume biocryptology account cannot be created without valid email
    return true
  }

  // return false by default
  return false
}

/**
 * Returns true for any user
 */
const isAny = (userId, doc) => {
  return true;
}

/**
 * Returns false for any user
 */
const isNone = (userId, doc) => {
  return false;
}

/**
 * Returns true for admin or owner users
 **/
const isAdminOrOwner = (userId, doc) => {
  const result = isAdmin(userId) || isOwner(userId, doc)
  // Log.log(['debug', 'access'], `isAdminOrOwner user ${userId}`, doc)
  return result
}

const anyCreateAdminOwnersUpdateRemove = {
	insert: isAny,
	update: isAdminOrOwner,
	remove: isAdminOrOwner
}

const anyCreateAdminOwnersUpdateAdminRemove = {
  insert: isAny,
  update: isAdminOrOwner,
  remove: isAdmin
}

const adminCreateUpdateRemove = {
	insert: isAdmin,
	update: isAdmin,
	remove: isAdmin
}

const anyInsertAdminUpdateRemove = {
	insert: isAny,
	update: isAdmin,
	remove: isAdmin
}

const noAccess = {
  insert: isNone,
  update: isNone,
  remove: isNone,
}

export const Access = {
  userLabel,
  userEmail,
  findUserByEmail,
  isUserEmailVerified,
  normaliseUser,
  isAdmin,
  isOwner,
  isHandler,
  signinAsGuest: Guest.sigin,
  isGuest: Guest.isGuest,
  isAny,
  isAdminOrOwner,
  isUser,
  anyCreateAdminOwnersUpdateRemove,
  anyCreateAdminOwnersUpdateAdminRemove,
  adminCreateUpdateRemove,
  anyInsertAdminUpdateRemove,
  noAccess
}
