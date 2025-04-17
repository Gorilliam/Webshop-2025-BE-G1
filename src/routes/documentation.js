import { postmanConfig, documentRoute } from "../util/postmanConfig.js";

// Product routes
documentRoute({
    name: "Get all products",
    method: "GET",
    url: "/api/products"
})

documentRoute({
    name: "Get a single product by id",
    method: "GET",
    url: "/api/products/:id"
})

documentRoute({
    name: "Get all proucts of a given category",
    method: "GET",
    url: "/api/products/by-category/:category"
})

documentRoute({
    name: "Get all proucts between two given prices",
    method: "GET",
    url: "/api/products/by-price/:min/:max"
})

documentRoute({
    name: "Create a new product (admin only)",
    method: "POST",
    url: "/api/products",
    body: {
        "_": "product fields go here"
    }
})

documentRoute({
    name: "Update a product (Admin only)",
    method: "PUT",
    url: "/api/products/:id"
})

documentRoute({
    name: "Delete a product (Admin only) by id as URL parameter",
    method: "DELETE",
    url: "/api/products/:id"
})

documentRoute({
    name: "Delete a product (Admin only) by id OR name in JSON body",
    method: "DELETE",
    url: "/api/products",
    body: {
        id: "ID OR NAME GOES HERE"
    }
})

// Category Routes
documentRoute({
    name: "Get all categories",
    method: "GET",
    url: "/api/categories"
})

// User routes
documentRoute({
    name: "Sign up (returns userData and token)",
    method: "POST",
    url: "/api/auth/signup",
    body: {
        email: "email here",
        firstName: "first name",
        lastName: "last name",
        password: "password"
    }
})

documentRoute({
    name: "Log in (returns userData and token)",
    method: "POST",
    url: "/api/auth/login",
    body: {
        email: "email",
        password: "password"
    }
})

documentRoute({
    name: "Get 'me' (user data) [must have cookie called hakim-livs-token]",
    method: "GET",
    url: "/api/auth/me"
})

// Order routes
documentRoute({
    name: "Get all orders",
    method: "GET",
    url: "/api/orders"
})

documentRoute({
    name: "Add order",
    method: "POST",
    url: "/api/orders",
    body: {
        firstName: "first name",
        lastName: "last name",
        address: "address",
        email: "email",
        phoneNumber: "phone number",
        user: "OPTIONAL objectId of the user",
        products: [
            {
                productId: "Object id goes here",
                quantity: 1
            },
            {
                productId: "Object id goes here",
                quantity: 1
            }
        ]
    }
})

// Test routes
documentRoute({
    name: "Add a product",
    method: "POST",
    url: "/api/test/addProduct",
    body: {
        "_": "Product fields go here"
    }
})

documentRoute({
    name: "Add multiple products",
    method: "POST",
    url: "/api/test/addProducts",
    body: [
        {},
        {},
        {}
    ]
})

documentRoute({
    name: "Add a category",
    method: "POST",
    url: "/api/test/addCategory",
    body: {
        "name": "Category name"
    }
})

documentRoute({
    name: "Add multiple categories",
    method: "POST",
    url: "/api/test/addCategories",
    body: [
        {},
        {},
        {}
    ]
})

documentRoute({
    name: "Delete all products",
    method: "DELETE",
    url: "/api/test/purgeProducts"
})

documentRoute({
    name: "Delete all categories",
    method: "DELETE",
    url: "/api/test/purgeCategories"
})

documentRoute({
    name: "Delete all users",
    method: "DELETE",
    url: "/api/test/purgeUsers"
})

documentRoute({
    name: "Delete all orders",
    method: "DELETE",
    url: "/api/test/purgeOrders"
})

documentRoute({
    name: "Delete all products, users, orders, and categories",
    method: "DELETE",
    url: "/api/test/purgeAll"
})

documentRoute({
    name: "Get all users (test)",
    method: "GET",
    url: "/api/test/users"
})

documentRoute({
    name: "Sign up (test)",
    method: "POST",
    url: "/api/test/users",
    body: {
        username: "user123",
        password: "abcdefg",
        isAdmin: false
    }
})

documentRoute({
    name: "Log in (test)",
    method: "POST",
    url: "/api/test/users/login",
    body: {
        username: "user123",
        password: "abcdefg"
    }
})

documentRoute({
    name: "Get me (test)",
    method: "GET",
    url: "/api/test/users/me"
})

documentRoute({
    name: "Log out (test)",
    method: "GET",
    url: "/api/test/users/logout"
})

documentRoute({
    name: "Add orders (test)",
    method: "POST",
    url: "/api/test/addOrders",
    body: [
        {
            firstName: "first name",
            lastName: "last name",
            address: "Gatunummer 73 Postort postnummer",
            email: "email",
            phoneNumber: "phone number",
            user: "OPTIONAL objectId of the user",
            products: [
                {
                    productId: "Object id goes here",
                    quantity: 1
                },
                {
                    productId: "Object id goes here",
                    quantity: 1
                }
            ]
        },
        {
            firstName: "first name",
            lastName: "last name",
            address: "Gatunummer 73 Postort postnummer",
            email: "email",
            phoneNumber: "phone number",
            user: "OPTIONAL objectId of the user",
            products: [
                {
                    productId: "Object id goes here",
                    quantity: 1
                }
            ]
        }
    ]
})

documentRoute({
    name: "Insert docs (test)",
    method: "POST",
    url: "/api/test/insertDocs",
    body: {
        purgeAllFirst: false,
        users: [],
        products: [],
        categories: []
    }
})

const apiDocumentation = (req, res) => {
    res.json(postmanConfig)
}

export default apiDocumentation