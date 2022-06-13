import User from "../models/user.js"

const buyItem = async (parameters, user, msg) => {
  if (['1', '2', '3', '4'].includes(parameters[2])) {
    if (!Number.isNaN(parseInt(parameters[3]))) {
      const prices = [200, 500, 1500, 100000]
      let cost = parseInt(parameters[3]) * prices[parseInt(parameters[2]) - 1]
      if (cost <= user.coins) {
        const obj = {}
        obj['1'] = { $inc: { 'pokeBalls': parameters[3], 'coins': -1 * cost } }
        obj['2'] = { $inc: { 'greatBalls': parameters[3], 'coins': -1 * cost } }
        obj['3'] = { $inc: { 'ultraBalls': parameters[3], 'coins': -1 * cost } }
        obj['4'] = { $inc: { 'masterBalls': parameters[3], 'coins': -1 * cost } }

        const items = {
          '1': 'Pokeballs',
          '2': 'Greatballs',
          '3': 'Ultraballs',
          '4': 'Masterballs'
        }

        await User.findByIdAndUpdate(msg.author.id, obj[parameters[2]])

        await msg.channel.send(`Successfully purchased ${parameters[3]} ${items[parameters[2]]} for ${cost} coins`)
      } else {
        await msg.channel.send("You do not have enough coins")
      }
    } else {
      await msg.channel.send("Invalid amount entered")
    }
  } else {
    await msg.channel.send("This item does not exist in the shop")
  }
}

export default buyItem