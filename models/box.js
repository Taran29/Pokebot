import mongoose from "mongoose";

const boxSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  box: {
    type: [{
      name: {
        type: String,
      },
      number: {
        type: Number,
        default: 1
      }
    }]
  }
})

const Box = mongoose.model('box', boxSchema)

export default Box