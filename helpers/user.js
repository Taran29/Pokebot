import User from '../models/user.js'
import Box from '../models/box.js'

const profileFunction = async (userName, userId) => {
  const existingUser = await User.findById(userId)
  if (existingUser) {
    return existingUser
  }

  const user = new User({ _id: userId, name: userName })
  const box = new Box({
    _id: userId,
    box: []
  })

  try {
    const boxResult = await box.save()
    const result = await user.save()
    return result
  } catch (err) {
    console.log(err)
  }
}

export default profileFunction

