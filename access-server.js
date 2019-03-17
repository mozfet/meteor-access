// imports
import { Access } from './access-both.js'

// methods
Meteor.methods({
  'mozfet:access.userEmail'() {
    return Access.userEmail(Meteor.userId())
  },
  'mozfet:access.userFirstName'() {
    return Access.userFirstName(Meteor.userId())
  },
  'mozfet:access.userLastName'() {
    return Access.userLastName(Meteor.userId())
  }
})

// when a new user is created
Accounts.onCreateUser(function (options, user) {

  // init the user profile
  user.profile = options.profile?options.profile:{}
  user.profile.label = Access.userLabel(user)
  user.profile.firstName = Access.userFirstName(user)
  user.profile.lastName = Access.userLastName(user)
  user.profile.email = Access.userEmail(user)
  user.profile.language = Access.userLanguage(user)

  Log.log(['debug', 'access'], `Update user profile:`, user.profile)

  // before returning the user
  return user
})

// on startup
Meteor.startup(() => {

  // if migrate user accounts
  if (Meteor.settings.accounts &&
      Meteor.settings.accounts.updateAllUserProfilesOnStartup) {
    // find all users
    const users = Meteor.users.find({}).fetch()

    // migrate all users
    for (let user of users) {
      Meteor.users.update(user._id, {$set: {
        'profile.label': Access.userLabel(user),
        'profile.firstName': Access.userFirstName(user),
        'profile.lastName': Access.userLastName(user),
        'profile.email': Access.userEmail(user),
        'profile.language': Access.userLanguage(user)
      }})
    }
  }
})

// exports
export { Access }
