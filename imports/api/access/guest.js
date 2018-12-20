import { Random } from 'meteor/random'
import Moniker from 'moniker'

/**
 * Create options for a new guest account
 * @param {}  -
 * @returns {}
 **/
function createGuestOptions() {
  let username = Moniker.choose()
  while (Meteor.users.find({username}).count()>0) {
    username = Moniker.choose()
  }
  return {
    username,
    email: `${username}@example.com`,
    password: Random.id(),
    profile: {
      language: "en-US",
      guest: true
    }
  }
}

/**
 * Create guest account
 * @param {}  -
 * @returns {}
 **/
function createGuestMethod() {
  Log.log(['debug', 'access', 'guest'], 'Creating guest user');
  const options = createGuestOptions()
  Log.log(['debug', 'access', 'guest'], 'Guest options:', options);
  const user = Accounts.createUser(options)
  Roles.addUsersToRoles(user, ['guest'], Roles.GLOBAL_GROUP)
  return options
}

/**
 * Check if user is a guest
 * @param {String} userId -
 * @returns {boolean} true if user is a guest
 **/
function isGuest (userId) {
  const id = userId?userId:Meteor.userId()
  return Roles.userIsInRole(id, ['guest'])
}

/**
 * Polymorphic creation of a guest user
 * @param {}  -
 * @returns {Promise} promise to resolve with guest user credentials
 **/
function createGuest() {
  Log.log(['debug', 'access', 'guest'], 'Create guest polymorphic.');
  return new Promise((resolve, reject) => {
    if (Meteor.isServer)  {
      Log.log(['debug', 'access', 'guest'], 'Create guest account.');
      resolve(createGuestMethod());
    }
    else {
      Log.log(['debug', 'access', 'guest'], 'Call meteor server method to create guest account.');
      Meteor.call('access.guest.create', (error, response) => {
        Log.log(['debug', 'access', 'guest'], 'Server method response:', error, response);
        if (error) {
          reject(error)
        }
        else {
          resolve(response)
        }
      })
    }
  })
}

/**
 * Destroy guest account
 * @param {String} userId - the guest user to destroy
 * @returns {undefined}
 **/
function destroyGuestMethod(userId) {
  if (isGuest(userId)) {
    Meteor.users.remove(userId)
  }
}

/**
 * Polymorphic destruction of a guest user
 * @param {String} userId - id of the guest user
 * @returns {Promise}
 **/
function destroyGuest(userId) {
  return new Promise((resolve, reject) => {
    if (Meteor.isServer)  {
      destroyGuestMethod(userId)
      resolve()
    }
    else {
      Meteor.call('access.guest.destroy', (error, response) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(response)
        }
      })
    }
  })
}

/**
 * Sign in as guest account on client.
 **/
async function signinAsGuest() {
  Log.log(['debug', 'access', 'guest'], 'Sign in as guest.')
  const options = await createGuest()
  Log.log(['debug', 'access', 'guest'], 'Greated guest:', options)
  Meteor.loginWithPassword(options.email, options.password)
}

// polymorphic startup code
Meteor.startup(() => {
  if (Meteor.isServer) {
    Meteor.methods({'access.guest.create': createGuestMethod})
    Meteor.methods({'access.guest.destroy': destroyGuestMethod})
  }
  Meteor.methods({'access.guest.signin': async () => {
    if (Meteor.isClient) {
      await signinAsGuest()
    }
  }})
})

// export polymrphic javascript api as object of functions
export default {
  create: createGuest,
  destroy: destroyGuest,
  signin: signinAsGuest,
  isGuest: isGuest
}
