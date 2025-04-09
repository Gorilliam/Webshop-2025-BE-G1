
// in your api.js file
export async function fetchCategories() {
    const res = await fetch(BACKEND + "/categories")
    const categories = await res.json()
    return categories
}

// in the file where you render the buttons
import { fetchProducts, fetchCategories } from '../utils/api.js'

function createCategoryButton(category) {
    const btn = document.createElement('button')
    // <button></button>
    
    btn.classList.add(`category-button`)
    // <button class="category-button"></button>

    btn.innerText = category.name
    // <button class="category-button">Mejeri</button>

    btn.addEventListener('click', function() {
        // You must a function which is called when the button is clicked
        handleCategoryButtonClick(category)
    })
    
    return btn
}


async function renderCategoryButtons() {
    const categories = await fetchCategories()
    categories.forEach(function(category) {
        const btn = createCategoryButton(category)

        // You must have an element to append the buttons into
        document.querySelector("parent element").appendChild(btn)
    })
}
