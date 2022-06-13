import { MessageEmbed } from "discord.js"

const strings = {
  'pb': 'Poke ball',
  'gb': 'Great ball',
  'ub': 'Ultra ball',
  'mb': 'Master ball'
}

const pokemonEmbedFunction = (usr, pokemon, rarity) => {
  return new MessageEmbed()
    .setColor(rarity.color)
    .setTitle(`${usr.name} found a wild ${pokemon.name}`)
    .setURL('')
    .setAuthor({ name: 'A wild pokemon appeared', iconURL: '', url: '' })
    .setFooter({
      text: `Rarity: ${pokemon.rarity} (${rarity.probability * 100}% encounter rate)
Pokeballs: ${usr.pokeBalls} | Greatballs: ${usr.greatBalls} | Ultraballs: ${usr.ultraBalls} | Masterballs: ${usr.masterBalls}`
    })
}

const pokemonRanAwayEmbed = (pokemon) => {
  return new MessageEmbed()
    .setColor("#000000")
    .setTitle(`${pokemon} ran away`)
}

const pokemonCaughtEmbed = (user, pokeball, pokemon, rarity, earned) => {
  return new MessageEmbed()
    .setColor(rarity.color)
    .setTitle(`You caught a ${pokemon.name} with a ${strings[pokeball]}`)
    .setURL('')
    .setAuthor({ name: `🥳 Congratulations, ${user.name}`, iconURL: '', url: '' })
    .setFooter({
      text: `Rarity: ${pokemon.rarity} (${rarity.probability * 100}% encounter rate)
Pokeballs: ${user.pokeBalls} | Greatballs: ${user.greatBalls} | Ultraballs: ${user.ultraBalls} | Masterballs: ${user.masterBalls}

You earned ${earned} coins!`
    })
}

const pokemonNotCaughtEmbed = (user, pokeball, pokemon, rarity) => {
  return new MessageEmbed()
    .setColor(rarity.color)
    .setTitle(`${pokemon.name} broke out of the ${strings[pokeball]}`)
    .setURL('')
    .setAuthor({ name: `❌ ${user.name} used a ${strings[pokeball]}`, iconURL: '', url: '' })
    .setFooter({
      text: `Rarity: ${pokemon.rarity} (${rarity.probability * 100}% encounter rate)
Pokeballs: ${user.pokeBalls} | Greatballs: ${user.greatBalls} | Ultraballs: ${user.ultraBalls} | Masterballs: ${user.masterBalls}`
    })
}

const userEmbedFunction = (user) => {
  return new MessageEmbed()
    .setColor("#0000ff")
    .setTitle(user.name)
    .setDescription(`Coins: ${user.coins}\nDate Joined: ${user.dateJoined}`)
}

const shopEmbed = (user) => {
  return new MessageEmbed()
    .setColor('#50C878')
    .setTitle('Buy some items for your adventure!')
    .setAuthor({ name: '💲Pokemon Shop' })
    .setDescription(`${user.name}'s coins: ${user.coins}`)
    .addFields(
      {
        name: "Item",
        value: `
1. Pokeball
2. Greatball
3. Ultraball
4. Masterball`,
        inline: true
      },
      {
        name: "Price",
        value: `200
500
1,500
100,000`,
        inline: true
      })
    .setFooter({
      text: `Usage: _shop buy {id #} {amount}
Example: shop buy 2 20 (buys 20 Greatballs)`
    })
}

const boxEmbed = (user, pageNumber, totalPages, str1, str2) => {
  return new MessageEmbed()
    .setTitle(`${user.name}'s Box`)
    .setColor('#D034EB')
    .addFields(
      {
        name: `📖 Page ${pageNumber}`,
        value: str1,
        inline: true
      },
      {
        name: '\u200b',
        value: str2 || '\u200b',
        inline: true
      }
    )
    .addField("Box Commands (Type in chat)", `⬅️back ➡️next 🔢page#`, false)
    .setFooter({
      text: `Box page ${pageNumber}/${totalPages} · Sorted by: Number Owned
This message expires in 20 seconds`
    })
}

const invEmbed = (user) => {
  return new MessageEmbed()
    .setTitle(`🎒 ${user.name}'s Inventory`)
    .setColor('#D22B2B')
    .setFooter({
      text: `Coins: ${user.coins}
Pokeballs: ${user.pokeBalls}
Greatballs: ${user.greatBalls}
Ultraballs: ${user.ultraBalls}
Masterballs: ${user.masterBalls}`
    })
}

const helpEmbed = () => {
  return new MessageEmbed()
    .setTitle('Pokebot Help')
    .setColor('#EB34C3')
    .setDescription(`These are the available commands
_profile: Create/see your profile
_p: Spawns a new pokemon, then use pb/gb/ub/mb to catch
_shop: Buy more pokeballs to catch more pokemon
_bag: Check your inventory
_coins: Check your coins
_box: Check which pokemon you have caught
_dex: Check all available pokemon
_dex {name}: Check single pokemon info using its name
_dex {number}: Check single pokemon info using its pokedex number

Pokeball info
pb: Standard pokeball
gb: Great ball. Offers slightly better catch rate than standard pokeball
ub: Ultra ball. Offers better catch rate than great ball
mb: Master ball. Never fails to catch a pokemon`)
}

const dexEmbed = (pokemon, total, pageNumber, totalPages) => {
  let str = ''
  pokemon.forEach((pkmn) => {
    str = str + (pkmn.number) + '. ' + pkmn.name + '\n'
  })
  return new MessageEmbed()
    .setColor('#6495ED')
    .setTitle("Pokedex")
    .setDescription(str)
    .setFooter({
      text: `Pokedex pages (Type in chat)
⬅️back ➡️next 🔢page#
Total: ${total} | Page: ${pageNumber}/${totalPages}
This message will expire in 20 seconds`
    })
}

const dexInfoEmbed = (pokemon, color) => {
  return new MessageEmbed()
    .setColor(color)
    .setTitle(`${pokemon[0].name} #${pokemon[0].number}`)
    .setDescription(`Type: ${pokemon[0].type1} ${pokemon[0].type2 || '\u200b'}
Rarity: ${pokemon[0].rarity}`)
    .addFields(
      { name: 'Base Attack', value: pokemon[0].stats.baseAtk.toString(), inline: true },
      { name: 'Base Defense', value: pokemon[0].stats.baseDef.toString(), inline: true },
      { name: 'Base HP', value: pokemon[0].stats.baseHP.toString(), inline: true },
      { name: 'Base Special Attack', value: pokemon[0].stats.baseSpAtk.toString(), inline: true },
      { name: 'Base Special Def', value: pokemon[0].stats.baseSpDef.toString(), inline: true },
      { name: 'Base Speed', value: pokemon[0].stats.baseSpd.toString(), inline: true },
    )
}

export {
  pokemonEmbedFunction as pokemonEmbedFunction,
  pokemonRanAwayEmbed as pokemonRanAwayEmbed,
  pokemonCaughtEmbed as pokemonCaughtEmbed,
  pokemonNotCaughtEmbed as pokemonNotCaughtEmbed,
  userEmbedFunction as userEmbedFunction,
  shopEmbed as shopEmbed,
  boxEmbed as boxEmbed,
  invEmbed as invEmbed,
  helpEmbed as helpEmbed,
  dexEmbed as dexEmbed,
  dexInfoEmbed as dexInfoEmbed
}