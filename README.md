# Meteor Access

Making user management and access to data simpler on Meteor.
Works with accounts-password, accounts-biocryptology and accounts-facebook.

## Polymorphic API
- User management
- Access control
- Document ownership
- Common permissions for use with <collection>.allow()

## Installation
```
$ meteor add mozfet:access
```

## Usage
```
import { Access } from 'meteor/mozfet:access'

const isCurrentUserAdmin = Access.isAdmin()

const user = Meteor.user()
const isUserAdmin = Access.isAdmin(user)
const email = Access.userEmail(user)
```
