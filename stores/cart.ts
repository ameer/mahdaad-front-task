import {defineStore} from 'pinia';

// Interfaces

interface Customer {
    id: number
    name: string
    city: string
}

interface Purchase {
    customerId: number
    productId: number
    date: string
}

interface CartItem {
    product: Product
    quantity: number
}

interface Product {
    id: number
    name: string
    category: string
}

// Initial Data

const customers: Customer[] = [ 
    { id: 1, name: "Ahmad", city: "Tehran" }, 
    { id: 2, name: "Mehran", city: "Shiraz" }, 
    { id: 3, name: "Ali", city: "Esfahan" }, 
];

const products: Product[] = [ 
    { id: 101, name: "Laptop", category: "Electronics" }, 
    { id: 102, name: "Mouse", category: "Electronics" }, 
    { id: 103, name: "Monitor", category: "Electronics" }, 
    { id: 104, name: "Coffee Maker", category: "Home Appliances" }, 
    { id: 105, name: "Blender", category: "Home Appliances" }, 
    { id: 106, name: "Headphones", category: "Electronics" }, 
];

const purchases: Purchase[] = [ 
    { customerId: 1, productId: 101, date: "2025-03-01" }, 
    { customerId: 1, productId: 102, date: "2025-02-02" }, 
    { customerId: 2, productId: 103, date: "2025-02-05" }, 
    { customerId: 2, productId: 104, date: "2025-02-06" }, 
    { customerId: 3, productId: 105, date: "2025-02-07" }, 
    { customerId: 3, productId: 106, date: "2025-02-08" }, 
    { customerId: 1, productId: 104, date: "2025-02-10" }, 
];

export const useCartStore = defineStore('cart', {
    state: () => ({
        cartItems: [] as CartItem[]
    }),
    getters: {
        totalItemsInCart(state):number {
            return state.cartItems.reduce((total, item) => total + item.quantity, 0)
        },
        uniqueProductsInCart(state): number {
            return state.cartItems.length
        }
    },

    actions: {
        // Load cart data from LS
        loadCart(){
            try {
                const storedCart = localStorage.getItem('ecommerce_cart')
                if(storedCart){
                    this.cartItems = JSON.parse(storedCart)
                }
            } catch (error) {
                console.error('Failed to load cart from Local Storage:', error)

                // Fallback to empty cart

                this.cartItems = []
            }
        },
        // Save cart data to local storage
        saveCart(){
            try {
                localStorage.setItem('ecommerce_cart', JSON.stringify(this.cartItems))
            } catch (error) {
                console.error("Failed to save cart data to Local Storage:", error)
            }
        },

        addToCart(product: Product) {
            const existingItem: CartItem = this.cartItems.find((item: CartItem) => item.product.id === product.id)

            if(existingItem) {
                existingItem.quantity++
            } else {
                this.cartItems.push({product, quantity: 1})
            }
            this.saveCart() // Persist changes to localStorage
        },

        removeFromCart(productId: number) {
            const index = this.cartItems.findIndex((item: CartItem) => item.product.id === productId)
            if(index !== -1) {
                if(this.cartItems[index].quantity > 1) {
                    this.cartItems[index].quantity--
                } else {
                    // Remove if quantity is 1
                    this.cartItems.splice(index, 1)
                }
                this.saveCart()
            }
        },
        clearCart(){
            this.cartItems = []
            this.saveCart()
        }
    }
})

useCartStore().loadCart()