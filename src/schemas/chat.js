import Joi from './joi'

export const startChat = userId => Joi.object().keys({
  title: Joi.string().min(4).max(50).label('Title'),
  userIds: Joi.array().min(1).max(100).unique().items(
    Joi.objectId().not(userId).label('User ID')
  ).label('User IDs')
})
