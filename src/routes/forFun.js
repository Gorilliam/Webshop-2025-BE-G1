import { Router } from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const veganProducts = [
    {
        "name": "Oatly Havremjölk",
        "price": 24.95,
        "image": "",
        "unit": "l",
        "amount": 1,
        "brand": "Oatly",
        "discount": 1,
        "description": "Krämig havremjölk utan tillsatser",
        "stock": 35,
        "image": "https://owp.klarna.com/product/252x252/1618014392/Oatly-Havremjoelk-100cl.jpg"
    },
    {
        "name": "Alpro Sojamjölk",
        "price": 22.50,
        "image": "",
        "unit": "l",
        "amount": 1,
        "brand": "Alpro",
        "discount": 1,
        "description": "Sojabaserad mjölk med tillagd vitamin D",
        "stock": 28,
        "image": "https://pi.nice-cdn.com/upload/image/product/large/default/alpro-bebida-vegetal-de-soja-original-1-l-1193379-es.png"
    },
    {
        "name": "Växtbaserad smör",
        "price": 32.95,
        "image": "",
        "unit": "g",
        "amount": 400,
        "brand": "Becel",
        "discount": 1,
        "description": "Veganskt smör alternativ",
        "stock": 20,
        "image": "https://public.keskofiles.com/f/k-ruoka/product/8719200057395?w=1200&h=630&fm=jpg&q=90&fit=fill&bg=ffffff"
    },
    {
        "name": "Anamma Vegofärs",
        "price": 39.90,
        "image": "",
        "unit": "g",
        "amount": 400,
        "brand": "Anamma",
        "discount": 1,
        "description": "Vegetabilisk färs på sojaprotein",
        "stock": 15,
        "image": "https://assets.icanet.se/image/upload/cs_srgb/t_product_large_v1/v1672146951/xx42rldhknh3hg2cuq7p.jpg"
    },
    {
        "name": "Planti havregrädde",
        "price": 29.95,
        "image": "",
        "unit": "ml",
        "amount": 500,
        "brand": "Planti",
        "discount": 1,
        "description": "Veganskt vispgrädde alternativ på havre",
        "image": "https://www.green-n-lean.se/img/vegansk-gr%C3%A4dde/img-1.png",
        "stock": 18
    },
    {
        "name": "Violife veganska slices",
        "price": 49.90,
        "image": "",
        "unit": "g",
        "amount": 200,
        "brand": "Violife",
        "discount": 1,
        "description": "Vegansk ost på kokosfett med smak av mozarella",
        "stock": 12,
        "image": "https://assets.icanet.se/image/upload/cs_srgb/t_product_large_v1/v1671015428/hed8prqsa8pc5huxvwkj.jpg"
    },
    {
        "name": "ICA Vego-cabanossy",
        "price": 45.50,
        "image": "",
        "unit": "g",
        "amount": 300,
        "brand": "ICA",
        "discount": 1,
        "description": "Veganska grillkorvar med paprika och vitlök",
        "stock": 22,
        "image": "https://blivegan.com/wp-content/uploads/ica_vego_cabanossy_vegansk_korv_nyhet.jpg"
    },
    {
        "name": "Hellman's Vegansk Majonnäs",
        "price": 34.90,
        "image": "",
        "unit": "ml",
        "amount": 400,
        "brand": "Hellman's",
        "discount": 1,
        "description": "Krämig vegansk majonnäs utan ägg",
        "stock": 25,
        "image": "https://s3-eu-north-1.amazonaws.com/applet.malardalen.se/malardalengamla/89b685a69c673f6689693e93d1396aee.jpg"
    },
    {
        "name": "Hälsans Kök Bitar à la kyckling",
        "price": 42.95,
        "image": "",
        "unit": "g",
        "amount": 350,
        "brand": "Hälsans Kök",
        "discount": 1,
        "description": "Veganskt kycklingalternativ på vassleprotein",
        "stock": 14,
        "image": "https://www.ninasmatrecept.se/bilder/2009/10/halsans-kok-Bitar-ala-Kyckling.jpg"
    },
    {
        "name": "Oumph Crispy Buffalo Bites",
        "price": 39.90,
        "image": "",
        "unit": "g",
        "amount": 280,
        "brand": "Oumph",
        "discount": 1,
        "description": "Veganska buffalo wing alternativ",
        "stock": 19,
        "image": "https://assets.iceland.co.uk/i/iceland/oumph_crispy_buffalo_bites_280g_88520_T1.jpg"
    },
    {
        "name": "Almondy Mandeltårta",
        "price": 89.95,
        "image": "",
        "unit": "g",
        "amount": 600,
        "brand": "Almondy",
        "discount": 1,
        "description": "Vegansk mandeltårta med chokladbotten",
        "stock": 8,
        "image": "https://www.almondy.com/wp-content/uploads/2022/10/AL450-19-Mandel-400g-EU1-2-700x705.png"
    },
    {
        "name": "Anamma Vegansk Falafel",
        "price": 36.50,
        "image": "",
        "unit": "g",
        "amount": 400,
        "brand": "Anamma",
        "discount": 1,
        "description": "Veganska falafelbollar med kikärter och kryddor",
        "stock": 24,
        "image": "https://www.anamma.eu/wp-content/uploads/sites/36/2025/04/image-7.png"
    },
    {
        "name": "Oatly Strawberry Confusion",
        "price": 49.95,
        "image": "",
        "unit": "ml",
        "amount": 500,
        "brand": "Oatly",
        "discount": 1,
        "description": "Krämig vegansk jordgubbsglass på havremjölk",
        "stock": 10,
        "image": "https://www.deutschlandistvegan.de/wp-content/uploads/2023/03/Oatly_Ice-Cream-Strawberry-Confusion-1536x1536.png"
    }
]

const fun = Router()

fun.get("/vegan", async (req, res) => {
    try {
        const [added, failed] = await addVeganProducts()
        res.json({ added, failed })
    } catch (error) {
        res.status(500).json({error:error?.message})
    }
})

export async function addVeganProducts() {
    let veganCategory = await Category.findOne({ name: "Veganskt" })
    if (!veganCategory) veganCategory = await Category.create({ name: "Veganskt" })
    const addedProducts = []
    const failedProducts = []
    for (const product of veganProducts) {
        try {
            const newProduct = await Product.create({...product, category: veganCategory._id})
            addedProducts.push(newProduct)
        } catch (error) {
            failedProducts.push({
                error: error?.message,
                product
            })
        }
    }
    return [addedProducts, failedProducts]
}

export default fun