import Rarity from "../models/rarity.js";
import Pokemon from "../models/pokemon.js";

const generatePokemon = async () => {
  let rand = Math.floor(Math.random() * 100) / 100;
  const rarities = [
    { name: "Common", value: 0.4 },
    { name: "Uncommon", value: 0.7 },
    { name: "Rare", value: 0.96 },
    { name: "Super Rare", value: 0.98 },
    { name: "Legendary", value: 0.99 }
  ]

  let rarity
  for (let i = 0; i < rarities.length; i++) {
    if ((rand <= rarities[i].value)) {
      rarity = await Rarity.findOne({ name: rarities[i].name })
      break
    }
  }

  let max = rarity.pokemon.length
  let dexNumber = rarity.pokemon[Math.floor(Math.random() * max)]

  const pokemon = await Pokemon.findOne({ number: dexNumber })

  return [rarity, pokemon]
}

export default generatePokemon