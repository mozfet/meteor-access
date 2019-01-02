// imports
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore'
import { Access } from './access-both.js'
import './access-client.html'

Template.userEmail.onCreated(() => {
  const instance = Template.instance()
  instance.state = {
    userEmail: new ReactiveVar()
  }
  Meteor.call('mozfet:access.userEmail', (error, result) => {
    if (!error) {
      instance.state.userEmail.set(result)
    }
  })
})

// template helpers
Template.userEmail.helpers({
  content() {
    const instance = Template.instance()
    return instance.state.userEmail.get()
  }
})

async function userEmail() {
  return await new Promise(function(resolve, reject) {
    Meteor.call('mozfet:access.userEmail', (error, result) => {
      if (error) {reject(error)} else {
        resolve(result)
      }
    })
  })
}

// exports
export { Access }
