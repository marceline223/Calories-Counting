import {defineStore} from 'pinia'
import {ProductInfo} from "./store-types";

export const useRecordsStore = defineStore('recordsStore', {
    state: () => ({
        records: [
            {
                date: '2023-06-13',
                totalCalories: [0, 0, 0],
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
                totalCalories: [0, 0, 0],
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
        ],
        settings: {
            normOfCalories: null,
            weight: null,
            height: null,
            age: null,
            sex: 'female',
            activity: 1.2
        }
    }),
    getters: {
        allRecords: (state) => {
            return state.records;
        },
        recordByDate(state) {
            return (date) => {
                const record = state.records.find((record) => record.date === date);
                if (record){
                    return record
                }
                return {
                    date: date,
                    totalCalories: [0,0,0],
                    breakfast: [],
                    lunch: [],
                    dinner: []
                }
            }
        },
        getNormOfCalories(state) {
            return state.settings.normOfCalories;
        }
    },
    actions: {
        async fetchRecords() {
            const storedRecords = localStorage.getItem('records');
            if (storedRecords) {
                this.setRecords(JSON.parse(storedRecords));
            } else {
                localStorage.setItem('records', JSON.stringify(this.records));
            }
        },
        async fetchSettings() {
            const storedSettings = localStorage.getItem('settings');
            if (storedSettings) {
                this.setSettings(JSON.parse(storedSettings));
            } else {
                localStorage.setItem('settings', JSON.stringify(this.settings));
            }
        },
        setRecords(payload) {
            this.records = payload;
            localStorage.setItem('records', JSON.stringify(this.records));
        },
        setSettings(payload) {
            this.settings = payload;
            localStorage.setItem('settings', JSON.stringify(this.settings));
        },
        setTotalCalories(payload) {
            this.recordByDate(payload.date).totalCalories[payload.index] = payload.calories;
            localStorage.setItem('records', JSON.stringify(this.records));
        },
        deleteFromMeal(payload){
            const record = this.recordByDate(payload.date);
            console.log(payload.date);
            console.log('record = ' + record.name);
            switch (payload.type) {
                case 'breakfast': {
                    const index = record.breakfast.findIndex(item => item.id === payload.id);
                    console.log('item id = ' + payload.id)
                    console.log(index);
                    if (index !== -1) {
                        record.breakfast.splice(index, 1);
                    }
                    break;
                }
                case 'lunch': {
                    const index = record.lunch.findIndex(item => item.id === payload.id);
                    if (index !== -1) {
                        record.lunch.splice(index, 1);
                    }
                    break;
                }
                case 'dinner': {
                    const index = record.dinner.findIndex(item => item.id === payload.id);
                    if (index !== -1) {
                        record.dinner.splice(index, 1);
                    }
                    break;
                }
            }
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
        getProductNameById: (state) => {
            return (id) => state.products.find((product) => product.id === id).name;
        }
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
