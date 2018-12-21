// imports
import { _ } from 'meteor/underscore'
import { Access as AccessApi } from './access'
import { Ownership as OwnershipApi } from './ownership'

// exports
export const Access = _.extend(AccessApi, OwnershipApi)
