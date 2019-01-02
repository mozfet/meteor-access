// imports
import { Access } from './access-both.js'

// methods
Meteor.methods({
  'mozfet:access.userEmail'() {
    return Access.userEmail(Meteor.userId())
  }
})

// exports
export { Access }
