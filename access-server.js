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
  },
  'mozfet:access.userUsername'() {
    return Access.userUsername(Meteor.userId())
  },
  'mozfet:access.findUserByUsername'(username) {
    return Access.findUserByUsername(username)
  },
})

// exports
export { Access }
