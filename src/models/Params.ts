import { Schema, model } from 'mongoose'

const schema = new Schema({
  hash: { type: String, required: true, unique: true },
  bot: { type: String, required: true },
  timestamp: { type: String, required: true },
  queryParams: { type: Map, of: String, default: {} },
})

export default model('Params', schema)
