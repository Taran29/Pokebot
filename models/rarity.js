import mongoose from "mongoose"

const raritySchema = new mongoose.Schema({
  name: { type: String },
  color: { type: String },
  probability: { type: Number },
  catchRate: { type: Number },
  pokemon: { type: Array }
})

const Rarity = mongoose.model('rarity', raritySchema)

export default Rarity