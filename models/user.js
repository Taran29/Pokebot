import mongoose from 'mongoose'

let date = new Date()
date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  coins: { type: Number, default: 1000 },
  pokeBalls: { type: Number, default: 20 },
  greatBalls: { type: Number, default: 0 },
  ultraBalls: { type: Number, default: 0 },
  masterBalls: { type: Number, default: 0 },
  dateJoined: { type: String, default: date },
  isFirst: { type: Boolean, default: true }
})

const User = mongoose.model('user', userSchema)

export default User