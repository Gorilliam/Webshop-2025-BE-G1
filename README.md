# Hakim Livs API

## Endpoints

### User endpoints

| Method | URL | JSON | Cookie req. | Sets cookie | Admin | Dev |
|---|---|---|---|---|---|---|
|POST|/api/users/signup|X||X||
|POST|/api/users/login|X||X||
|GET|/api/users/me/||X|||

#### User test endpoints

| Method | URL | JSON | Cookie req. | Sets cookie | Admin | Dev |
|---|---|---|---|---|---|---|
|POST|/api/test/users|X||X||X|
|POST|/api/test/users/login|X||X||X|
|GET|/api/test/users/me/||X|||X|

### Category endpoints

### Product endpoints

## Models

### User

- Model name: user
- Collection name: users
```js
{
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
}
```

### Category

- Model name: category
- Collection name: categories

```js
{
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 100
    }
}
```

### Product

- Model name: Product
- Collection name: Products
```js
{
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
}
```
