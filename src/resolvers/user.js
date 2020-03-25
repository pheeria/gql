import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import { User } from '../models'
import { signUp, signIn } from '../schemas'
import * as Auth from '../auth'

export default {
  Query: {
    me: (root, args, { req }, info) => {
      // TODO: projection

      return User.findById(req.session.userId)
    },
    users: (root, args, { req }, info) => {
      // TODO: projection, pagination

      return User.find({})
    },
    user: (root, args, { req }, info) => {
      // TODO: projection, sanitization

      if (!mongoose.Types.ObjectId.isValid(args.id)) {
        throw new UserInputError(`${args.id} is not a valid user ID.`)
      }

      return User.findById(args.id)
    }
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      await signUp.validateAsync(args, { abortEarly: false })

      const user = await User.create(args)
      req.session.userId = user.id

      return user
    },
    signIn: async (root, args, { req }, info) => {
      await signIn.validateAsync(args, { abortEarly: false })

      const { email, password } = args
      const user = await Auth.attemptSignIn(email, password)

      req.session.userId = user.id

      return user
    },
    signOut: (root, args, { req, res }, info) => {
      return Auth.signOut(req, res)
    }
  }
}
