import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String },
  number: { type: Number },
  type1: { type: String },
  type2: { type: String, default: null },
  rarity: { type: String },
  stats: {
    baseAtk: { type: Number },
    baseDef: { type: Number },
    baseHP: { type: Number },
    baseSpd: { type: Number },
    baseSpAtk: { type: Number },
    baseSpDef: { type: Number }
  }
})

const Pokemon = mongoose.model('pokemon', pokemonSchema)

export default Pokemon