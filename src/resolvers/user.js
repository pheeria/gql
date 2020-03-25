import { User } from '../models'
import { signUp, signIn, objectId } from '../schemas'
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
    user: async (root, args, { req }, info) => {
      // TODO: projection

      await objectId.validateAsync(args, { abortEarly: false })

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
  },
  User: {
    chats: async (user, args, context, info) => {
      return (await user.populate('chats').execPopulate()).chats
    }
  }
}
