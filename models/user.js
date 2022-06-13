import mongoose from 'mongoose'

let date = new Date()
date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  coins: { type: Number, default: 50000 },
  pokeBalls: { type: Number, default: 50 },
  greatBalls: { type: Number, default: 50 },
  ultraBalls: { type: Number, default: 50 },
  masterBalls: { type: Number, default: 1 },
  dateJoined: { type: String, default: date },
  isFirst: { type: Boolean, default: true }
})

const User = mongoose.model('user', userSchema)

export default User