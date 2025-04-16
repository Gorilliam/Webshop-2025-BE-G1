import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ""  //Add a picture URL to something that will become a placeholder
  },
  unit: {  //Kilos, litres etc...
    type: String,
    enum: ['mg', 'g', 'kg', 'ml', 'cl', 'dl', 'l', 'pcs', 'st', 'oz', 'lb'],  // st= styck, pcs = pieces countable items, oz = ounce, lb = pound
    required: true
  },
  amount: {   //The number shown before unit type for a product
    type: Number,
    required: true,
    min: 0
  },
  brand:  {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 1,
    min: 0,
    max: 1
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true

  }
}, {
  timestamps: true
});


export default model('Product', productSchema);