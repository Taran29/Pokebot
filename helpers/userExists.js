import User from "../models/user.js"

const userExists = async (userId) => {
  const user = await User.findById(userId)
  if (user) return [true, user]
  return false
}

export default userExists