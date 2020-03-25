import { UserInputError } from 'apollo-server-express'
import { Chat, User, Message } from '../models'
import { startChat } from '../schemas'

export default {
  Mutation: {
    startChat: async (root, args, { req }, info) => {
      const { userId } = req.session
      await startChat(userId).validateAsync(args, { abortEarly: false })
      const { title, userIds } = args

      const idsFound = await User.where('_id').in(userIds).countDocuments()

      if (idsFound !== userIds.length) {
        throw new UserInputError('One or more User IDs are invalid.')
      }

      userIds.push(userId)

      const chat = await Chat.create({ title, users: userIds })

      await User.updateMany({ _id: { $in: userIds } }, {
        $push: { chats: chat }
      })

      return chat
    }
  },
  Chat: {
    users: async (chat, args, context, info) => {
      return (await chat.populate('users').execPopulate()).users
    },
    lastMessage: async (chat, args, context, info) => {
      return (await chat.populate('lastMessage').execPopulate()).lastMessage
    },
    messages: async (chat, args, context, info) => {
      // TODO: pagination, projection
      return Message.find({ chat: chat.id })
    }
  }
}
