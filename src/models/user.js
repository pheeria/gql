import mongoose from 'mongoose'
import { hash, compare } from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: email => User.doesNotExist({ email }),
        message: ({ value }) => `Email ${value} has already been taken.` // TODO: security
      }
    },
    username: {
      type: String,
      validate: {
        validator: username => User.doesNotExist({ username }),
        message: ({ value }) => `Username ${value} has already been taken.` // TODO: security
      }
    },
    name: String,
    password: String
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
