import Joi from '@hapi/joi'
import mongoose from 'mongoose'

export default Joi.extend(joi => ({
  type: 'objectId',
  base: joi.string(),
  messages: {
    'objectId.base': 'Must be a valid Object ID'
  },
  validate (value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId.base') }
    }
  }
}))
