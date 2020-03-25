import mongoose, { Schema } from 'mongoose'
import { hash, compare } from 'bcryptjs'

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: email => User.doesNotExist({ email }),
        message: ({ value }) => 'Email has already been taken.'
      }
    },
    username: {
      type: String,
      validate: {
        validator: username => User.doesNotExist({ username }),
        message: ({ value }) => 'Username has already been taken.'
      }
    },
    name: String,
    password: String,
    chats: [{
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    }]
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 8)
  }
})

userSchema.statics.doesNotExist = async function (options) {
  return await this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = async function (password) {
  return compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
