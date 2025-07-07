import {defineStore} from 'pinia';

// We should save below types in types.d.ts and types folder
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


// Also we should save these mock data in another file and import them. In this case we have it in all files to quick access :)
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
export const useECommerceDataStore = defineStore('ecommerceData', {

    state: () => ({
        customers: customers as Customer[],
        products: products as Product[],
        purchases: purchases as Purchase[]
    }),
    getters: {
        // Find all products purchased by each customer

        getPurchasesByCustomer: (state) => (customerId: number): Product[] => {
            const customerPurchases = state.purchases.filter((p: Purchase) => p.customerId === customerId)

            const purchasedProductIds = new Set(customerPurchases.map((p: Purchase) => p.productId))

            return state.products.filter((product: Product) => {
                purchasedProductIds.has(product.id)
            })
        },

        // Calculate the most purchased product category per customer

        getMostPurchasedCategory: (state) => (customerId:number): string | null => {
            const customerPurchasedProducts = state.purchases.filter((p: Purchase) => p.customerId === customerId)
            
            const categoryCounts: {[key: string]: number} = {}
            
            customerPurchasedProducts.forEach((purchase: Purchase) => {
                const product = state.products.find((p: Product) => p.id === purchase.productId)
                if(product){
                    categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1
                }
            })
            let mostFrequentCategory: string | null = null
            let maxCount = 0

            for (const category in categoryCounts) {
                if(categoryCounts[category] > maxCount){
                    maxCount = categoryCounts[category]
                    mostFrequentCategory = category
                }
            }
            return mostFrequentCategory
        },

        // Recommends products based on similar customers

        getRecommendedProducts: (state) => (targetCustomerId: number, filterByCity: boolean = false) : Product[] => {
            const targetCustomer = state.customers.find((c: Customer) => c.id === targetCustomerId)

            if(!targetCustomer) {
                return []
            }

            // Get target customer's most purchased category

            const targetCustomerMostPurchasedCategory = useECommerceDataStore().getMostPurchasedCategory(targetCustomerId)

            if(!targetCustomerMostPurchasedCategory) {
                return []
            }

            // Get products already purchased by the target customer to prevent recommending them again

            const targetCustomerPurchasedProductIds = new Set(state.purchases.filter((p: Purchase) => p.customerId === targetCustomerId).map((p: Purchase) => p.productId))

            const recommendedProductIds = new Set<number>()

            state.customers.forEach((otherCustomer: Customer) => {
                // Exclude target customer
                if(otherCustomer.id === targetCustomerId) {
                    return
                }

                if(filterByCity && otherCustomer.city !== targetCustomer.city) {
                    return
                }

                const otherCustomerMostPurchasedCategory = useECommerceDataStore().getMostPurchasedCategory(otherCustomer.id)

                if(otherCustomerMostPurchasedCategory === targetCustomerMostPurchasedCategory) {
                    const product = state.purchases
                    .filter((p: Purchase) => p.customerId === otherCustomer.id)
                    .forEach((purchase: Purchase) => {
                        const product = state.products.find((p: Product) => p.id === purchase.productId)
                    })
                    if(product && product.category === targetCustomerMostPurchasedCategory && !targetCustomerPurchasedProductIds.has(product.id)) {
                        recommendedProductIds.add(product.id)
                    }
                }
            })
            return Array.from(recommendedProductIds).map(id => state.products.find((p:Product) => p.id === id)!).filter(Boolean) as Product[]
        }
    }
})