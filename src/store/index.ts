import {defineStore} from 'pinia'
import {ProductInfo} from "./store-types";

export const useRecordsStore = defineStore('recordsStore', {
    state: () => ({
        records: [
            {
                date: '2023-06-13',
                breakfast: [
                    {
                        id: 1,
                        productId: 1,
                        count: 300
                    },
                    {
                        id: 2,
                        productId: 2,
                        count: 150
                    },
                    {
                        id: 3,
                        productId: 3,
                        count: 200
                    }
                ],
                lunch: [
                    {
                        id: 4,
                        productId: 1,
                        count: 100
                    },
                    {
                        id: 5,
                        productId: 5,
                        count: 120
                    }
                ],
                dinner: [
                    {
                        id: 6,
                        productId: 1,
                        count: 350
                    },
                    {
                        id: 7,
                        productId: 10,
                        count: 50
                    }
                ]
            },
            {
                date: '2023-06-12',
                breakfast: [
                    {
                        id: 8,
                        productId: 5,
                        count: 100
                    }
                ],
                lunch: [
                    {
                        id: 9,
                        productId: 4,
                        count: 200
                    },
                    {
                        id: 10,
                        productId: 1,
                        count: 60
                    }
                ],
                dinner: [
                    {
                        id: 11,
                        productId: 2,
                        count: 25
                    }
                ]

            }
        ]
    }),
    getters: {
        allRecords: (state) => {
            return state;
        },
        recordByDate(state) {
            return (date) => state.records.find((record) => record.date === date);
        }
    },
    actions: {
        async fetchRecords() {

        }
    },
});

export const useProductsStore = defineStore('productsStore', {
    state: () => ({
        products: [] as ProductInfo[],
        currentId: 0
    }),
    getters: {
        getProductById: (state) => {
            return (id) => state.products.find((product) => product.id === id)
        },
    },
    actions: {
        async fetchProducts() {
            const storedProductList = localStorage.getItem('products');
            if (!storedProductList) {
                //если данных нет в localStorage, загружаем из файла
                try {
                    const response = await fetch('src/assets/food_base.json');
                    const productList = await response.json();
                    this.products = productList;
                    this.currentId = productList.length;

                    localStorage.setItem('products', JSON.stringify(productList));
                    // для заполнения айдишников (уже не понадобится)
                    // for (let i = this.currentId; i < this.products.length; i++) {
                    //     this.products[i].id = i;
                    //     this.currentId++;
                    // }
                } catch (error) {
                    console.error('Failed to load products:', error);
                }
            } else {
                this.products = JSON.parse(storedProductList);
            }
        }
    }
});
