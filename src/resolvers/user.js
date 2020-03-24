import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import { User } from '../models'
import { signUp } from '../schemas'

export default {
  Query: {
    users: (root, args, context, info) => {
      // TODO: auth, projection, pagination

      return User.find({})
    },
    user: (root, args, context, info) => {
      // TODO: auth, projection, sanitization

      if (!mongoose.Types.ObjectId.isValid(args.id)) {
        throw new UserInputError(`${args.id} is not a valid user ID.`)
      }

      return User.findById(args.id)
    }
  },
  Mutation: {
    signUp: async (root, args, context, info) => {
      // TODO: not auth

      // validation
      await signUp.validateAsync(args, { abortEarly: false })

      return User.create(args)
    }
  }
}
