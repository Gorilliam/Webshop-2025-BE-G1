# Hakim Livs Backend

## Requirements

- git
- node/npm

## Getting started


Navigate to the folder you wish to install the app in, and run this command to clone the repo:

```bash
git clone https://github.com/Gorilliam/Webshop-2025-BE-G1 ./
```
Then install:
```bash
npm install
```
Then, in the root folder, create a file called `.env` with these variables:
```env
# Can be changed
PORT=5432

# Dev database
MONGODB_URI="mongodb://localhost:27017/hakim-livs"

# Or, Live database, should be changed
# MONGODB_URI="mongodb+srv://<db_username>:<db_password>@<db_domain>/hakim-livs?retryWrites=true&w=majority&appName=<cluster_name>"

# Should be changed
JWT_SECRET="jsonwebtoken secret here"
```
To seed the dev database with the test data in src/data, run this command:
```bash
npm run seed
```
To start the server, run:
```bash
npm run dev
```
If you are using a local database, make sure it is running so the server can connect.

To get a postman config in JSON format, go to `BACKEND_URL/api/` while the server is running.

## Database models

The app is powered by mongoose and uses the following schemas:

### Category

| FIELD | TYPE | INFO |
|-|-|-|
| name | string | required, unique, 3 - 100 chars

### Product

| FIELD | TYPE | INFO 
|-|-|-|
| name | string | required
| price | number | required, min 0
| image | string | defaults to ""
| unit | string | required, must be one of the following: mg, g, kg, ml, cl, dl, l, pcs, st, oz, lb
| amount | number | required, min 0 (number shown before the unit)
| brand | string | required
| discount | number | min 0, max 1, defaults to 1
| description | string | defaults to ""
| stock | number | min 0, defaults to 0
| category | ObjectId (category) | required

### User

| FIELD | TYPE | INFO |
|-|-|-|
| firstName | string | required
| lastName | string | required
| password | string | required, automatically hashed
| email | string | required, unique
| isAdmin | boolean | defaults to false

## Endpoints

A colon (:) before a word means it is a URL parameter. You are meant to replace it with something, without the colon.

For information on authentication, see the authentication section.

| METHOD | URL | WHAT IT'S FOR | INFO |
|--------|-----|---------------|------|
| GET | /api/ | Get api documentation, formatted for easily importing into postman ||
| GET | /api/categories | Get all categories ||
| GET | /api/products | Get all products ||
| GET | /api/products/:id | Get single product by id ||
| POST | /api/products | Create a product | Requires JSON object of new product and admin authentication |
| PUT | /api/products/:id | Update a product | Requires JSON object of product updates and admin authentication |
| DELETE | /api/products/:id | Delete a product ||
| DELETE | /api/prodcuts | Delete a product | Requires JSON object containing either an id or name property
| GET | /api/products/by-category/:nameOrId | Get all products of a given category ||
| GET | /api/products/by-price/:min/:max | Get all products within a price range | Can use "Infinity" for max
| POST | /api/auth/signup | Create a user | Requires JSON object of the new user to add. Sets a token-cookie.
| POST | /api/auth/login | Get an existing user and token | Requires JSON object containing email and password. Sets a token-cookie.
| GET | /api/auth/me | Checks for the token-cookie and returns user data if it's valid | Must have token-cookie
| POST | /api/test/addCategory | Create a category | Requires JSON object of new category to add. Only needs one field: name.
| POST | /api/test/addCategories | Create multiple categories at once. | Requires JSON array of new category objects.
| POST | /api/test/addProduct | Create a product | Requires JSON object of new product.
| POST | /api/test/addProducts | Create multiple products at once | Requires JSON array of new product objects.
| DELETE | /api/test/purgeCategories | Delete all categories ||
| DELETE | /api/test/purgeProducts | Delete all products ||
| DELETE | /api/test/purgeUsers | Delete all users ||
| DELETE | /api/test/purgeAll | Delete all categories, products, and users ||
| GET | /api/test/users | Get all users ||
| POST | /api/test/users | Create user | Requires JSON object of new user. Sets token-cookie.
| POST | /api/test/users/login | Get existing user with token | Requires JSON object with email and password. Sets token-cookie.
| GET | /api/test/users/me | Get user data if valid token-cookie exists | Must have valid token-cookie
| GET | /api/test/users/logout | Deletes token-cookie ||
| POST | /api/test/insertDocs | Insert several documents at once | Ability to purge all documents before creating (see below)

### Using the insertDocs test route for quick and easy testing

Simply make a `POST` request to `/api/test/insertDocs` with a JSON body that looks like the example below. sYou must, of course, fill in the data you want to insert.

```json
{
    "purgeAllFirst": true,
    "users": [{}, {}, {}],
    "categories": [{}, {}, {}],
    "products": [{}, {}, {}]
}
```

## Authentication

In order to make successful requests to certain endpoints, you must have a token-cookie attached to the client. This will be attached automatically on signup & login requests, regardless of whether they're made in the browser, or with another HTTP client such as Postman. Postman will automaticlly send the token-cookie back on requests, but fetch and axios will not. In order to ensure that this cookie is automatically passed back to the server during requests in the browser, an extra step must be taken so that the request is configured correctly. Below are examples with both the fetch API and axios.

```js
async function fetchExample() {
    const res = await fetch("URL GOES HERE", {
        headers: {
            "Content-Type": "application/json" 
            // ⬆ Required when sending json to the server ⬆
        },
        body: JSON.stringify(yourDataHere),
        credentials: "include"
        // ⬆ This is what attaches the cookie to the request ⬆
    })
}

async function axiosExample() {
    const res = await axios.post("URL GOES HERE", {
        // Your data here
    }, {
        withCredentials: true
        // ⬆ equivalent of credentials: "include" in fetch ⬆
    })
}
```
