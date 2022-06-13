import { Client, Intents } from 'discord.js'
import mongoose from 'mongoose'
import * as embeds from './embeds.js'
import profileFunction from './helpers/user.js'
import generatePokemon from './helpers/generatePokemon.js'
import updateCoins from './helpers/updateCoins.js'
import userExists from './helpers/userExists.js'
import splitStrings from './helpers/splitStrings.js'
import { config } from 'dotenv'
import User from './models/user.js'
import Pokemon from './models/pokemon.js'
import Rarity from './models/rarity.js'
import Box from './models/box.js'
import buyItem from './helpers/buyItem.js'
import http from 'http'

config()

const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('App is running.')
    res.end()
  }
}).listen(PORT)

const client = new Client({
  intents:
    [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ]
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB...')
  })
  .catch((error) => {
    console.log("Error: ", error.message)
  })

client.once("ready", () => {
  console.log('Bot is ready')
})

let currentSpawnStatus = false

client.on("messageCreate", async (msg) => {
  if (msg.content[0] === '_') {
    if (msg.content === '_profile') {
      const user = await profileFunction(msg.author.username, msg.author.id)
      msg.channel.send({ embeds: [embeds.userEmbedFunction(user)] })
    } else if (['_p', '_pokemon'].includes(msg.content)) {
      if (currentSpawnStatus) {
        msg.channel.send("A pokemon has already been spawned. Please catch it before spawning another.")
        return
      }
      const user = await userExists(msg.author.id)
      if (!user[0]) {
        msg.channel.send("User does not exist. Please make a profile by typing  _profile")
        return
      }

      let isCaught = false
      currentSpawnStatus = true

      const [rarity, pokemon] = await generatePokemon()

      setTimeout(() => {
        if (!isCaught) {
          message.edit({ embeds: [embeds.pokemonRanAwayEmbed(pokemon.name)] })
          currentSpawnStatus = false
        }
      }, 10000)

      const message = await msg.channel.send({ embeds: [embeds.pokemonEmbedFunction(user[1], pokemon, rarity)] })

      if (user[1].isFirst) {
        await msg.channel.send("Type pb to throw pokeball")
        await User.findByIdAndUpdate(msg.author.id, {
          $set: {
            'isFirst': false
          }
        })
      }

      try {
        const msg_filter = (m) => m.author.id === msg.author.id
        while (true) {
          const collected = await msg.channel.awaitMessages({ filter: msg_filter, max: 1, time: 10000 })

          const accept = ['pb', 'gb', 'ub', 'mb']
          const acceptRates = [0.1, 0.25, 0.35, 1]
          let pokeball = collected.at(0).content.toLowerCase()
          if (accept.includes(pokeball, 0)) {
            if (!isCaught) {
              const attr = {
                'pb': 'pokeBalls',
                'gb': 'greatBalls',
                'ub': 'ultraBalls',
                'mb': 'masterBalls'
              }

              if (user[1][attr[pokeball]] > 0) {

                let chance = Math.floor(Math.random() * 100) / 100
                let rate = rarity.catchRate + acceptRates[accept.indexOf(pokeball)]

                const obj = {}
                obj['pb'] = { $inc: { 'pokeBalls': -1 } }
                obj['gb'] = { $inc: { 'greatBalls': -1 } }
                obj['ub'] = { $inc: { 'ultraBalls': -1 } }
                obj['mb'] = { $inc: { 'masterBalls': -1 } }

                const updatedUser = await User.findByIdAndUpdate(msg.author.id, obj[pokeball], { new: true })

                if (chance <= rate) {
                  let earned = updateCoins(rarity, chance)
                  await User.findByIdAndUpdate(msg.author.id, { $inc: { coins: earned } })

                  await message.edit({ embeds: [embeds.pokemonCaughtEmbed(updatedUser, pokeball, pokemon, rarity, earned)] })
                  isCaught = true
                  currentSpawnStatus = false

                  const result = await Box.find({ box: { $elemMatch: { name: pokemon.name } } })

                  if (result.length === 0) {
                    const boxObj = {
                      name: pokemon.name,
                      number: 1
                    }

                    await Box.findByIdAndUpdate(msg.author.id, { $push: { 'box': boxObj } })
                  } else {
                    await Box.updateOne(
                      { "_id": msg.author.id, "box.name": pokemon.name },
                      { $inc: { "box.$.number": 1 } }
                    )
                  }

                } else {
                  await message.edit({ embeds: [embeds.pokemonNotCaughtEmbed(updatedUser, pokeball, pokemon, rarity)] })
                  isCaught = true
                  currentSpawnStatus = false
                }
              } else {
                msg.channel.send("You don't have that pokeball")
              }
            }
          }
        }
      } catch (error) { }
    } else if (['_shop', '_s'].includes(msg.content)) {
      const user = await userExists(msg.author.id)
      if (!user[0]) {
        msg.channel.send("User does not exist. Please make a profile by typing  _profile")
        return
      } else {
        await msg.channel.send({ embeds: [embeds.shopEmbed(user[1])] })
      }
    } else if (msg.content.match("_shop buy") || msg.content.match("_s buy")) {
      const user = await userExists(msg.author.id)
      if (!user[0]) {
        msg.channel.send("User does not exist. Please make a profile by typing  _profile")
        return
      } else {

        let parameters = msg.content.split(' ')
        await buyItem(parameters, user[1], msg)
      }
    } else if (msg.content === '_box') {
      const checkUser = await userExists(msg.author.id)
      if (!checkUser[0]) {
        msg.channel.send("User does not exist. Please make a profile by typing  _profile")
        return
      } else {
        let isRunning = true
        const user = checkUser[1]
        const pageSize = 20
        let pageNumber = 1
        const box = await Box.findById(msg.author.id)
        box.box.sort((a, b) => {
          return b.number - a.number
        })

        setTimeout(() => {
          isRunning = false
        }, 20000)

        let totalPages = Math.ceil(box.box.length / pageSize)
        let current = box.box.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
        let strings = splitStrings(current, pageSize)

        let message = await msg.channel.send({ embeds: [embeds.boxEmbed(user, pageNumber, totalPages, strings[0], strings[1])] })

        while (isRunning) {
          const msg_filter = m => m.author.id === msg.author.id
          try {
            const collected = await msg.channel.awaitMessages({ filter: msg_filter, max: 1, time: 20000 })

            let temp = collected.at(0).content.toLowerCase()
            if (['next', 'n'].includes(temp)) {
              if (pageNumber < totalPages) {
                pageNumber += 1
                let newCurrent = box.box.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                let strings = splitStrings(newCurrent, pageSize)
                await message.edit({ embeds: [embeds.boxEmbed(user, pageNumber, totalPages, strings[0], strings[1])] })
              }
            } else if (['back', 'b', 'p', 'prev'].includes(temp)) {
              if (pageNumber > 1) {
                pageNumber -= 1
                let newCurrent = box.box.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
                let strings = splitStrings(newCurrent, pageSize)
                await message.edit({ embeds: [embeds.boxEmbed(user, pageNumber, totalPages, strings[0], strings[1])] })
              }
            } else if (!Number.isNaN(parseInt(temp)) && (temp <= totalPages)) {
              pageNumber = parseInt(temp)
              let newCurrent = box.box.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
              let strings = splitStrings(newCurrent, pageSize)
              await message.edit({ embeds: [embeds.boxEmbed(user, pageNumber, totalPages, strings[0], strings[1])] })
            }
          } catch (error) { }
        }
      }
    } else if (['_bal', '_coins', '_balance'].includes(msg.content)) {
      const user = await User.findById(msg.author.id)
      if (!user) {
        await msg.channel.send("User does not exist. Please make one by typing  _profile")
      } else {
        await msg.channel.send(`Coins: ${user.coins}`)
      }
    } else if (['_inv', '_bag'].includes(msg.content)) {
      const user = await User.findById(msg.author.id)
      if (!user) {
        await msg.channel.send("User does not exist. Please make one by typing  _profile")
      } else {
        await msg.channel.send({ embeds: [embeds.invEmbed(user)] })
      }
    } else if (['_help', '_info'].includes(msg.content)) {
      await msg.channel.send({ embeds: [embeds.helpEmbed()] })
    } else if (msg.content.includes(['_dex'])) {
      let command = msg.content.split(' ')
      if (command.length === 1) {
        const pageSize = 10
        let pageNumber = 1
        const totalPages = Math.ceil(151 / pageSize)

        let isRunning = true

        let pokemon = await Pokemon
          .find()
          .sort({ number: 1 })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)

        const message = await msg.channel.send({ embeds: [embeds.dexEmbed(pokemon, 151, pageNumber, totalPages)] })

        setTimeout(() => {
          isRunning = false
        }, 20000)

        const msg_filter = m => m.author.id === msg.author.id

        while (isRunning) {
          try {
            const collected = await msg.channel.awaitMessages({ filter: msg_filter, max: 1, time: 20000 })
            let temp = collected.at(0).content.toLowerCase()

            if (['next', 'n'].includes(temp)) {
              if (pageNumber < totalPages) {
                pageNumber += 1
                let newPokemon = await Pokemon
                  .find()
                  .sort({ number: 1 })
                  .skip((pageNumber - 1) * pageSize)
                  .limit(pageSize)

                await message.edit({ embeds: [embeds.dexEmbed(newPokemon, 151, pageNumber, totalPages)] })
              }
            } else if (['back', 'b', 'prev'].includes(temp)) {
              if (pageNumber > 1) {
                pageNumber -= 1
                let newPokemon = await Pokemon
                  .find()
                  .sort({ number: 1 })
                  .skip((pageNumber - 1) * pageSize)
                  .limit(pageSize)

                await message.edit({ embeds: [embeds.dexEmbed(newPokemon, 151, pageNumber, totalPages)] })
              }
            } else if (!Number.isNaN(parseInt(temp)) && (temp <= totalPages)) {
              pageNumber = parseInt(temp)
              let newPokemon = await Pokemon
                .find()
                .sort({ number: 1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)

              await message.edit({ embeds: [embeds.dexEmbed(newPokemon, 151, pageNumber, totalPages)] })
            }
          } catch (error) { }
        }
      } else if (command.length > 1) {
        let queryParam = parseInt(command[1])
        if (!Number.isNaN(queryParam) && (queryParam <= 151) && (queryParam > 0)) {
          let pokemon = await Pokemon.find({ number: queryParam })
          let temp = await Rarity.find({ name: pokemon[0].rarity })
          let color = temp[0].color
          await msg.channel.send({ embeds: [embeds.dexInfoEmbed(pokemon, color)] })
        } else {
          let pokemon = await Pokemon.find({ 'name': { '$regex': command[1], $options: 'i' } })
          let temp = await Rarity.find({ name: pokemon[0].rarity })
          let color = temp[0].color
          if (pokemon.length > 0)
            await msg.channel.send({ embeds: [embeds.dexInfoEmbed(pokemon, color)] })
        }
      }
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)