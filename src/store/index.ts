import {defineStore} from 'pinia'
import {ProductInfo} from "./store-types";

export const useRecordsStore = defineStore('recordsStore', {
    state: () => ({
        records: [],
        settings: {
            normOfCalories: 0,
            weight: null,
            height: null,
            age: null,
            sex: 'female',
            activity: 1.2
        },
        currentId: 12,
        chosenDate: null
    }),
    getters: {
        allRecords: (state) => {
            return state.records;
        },
        recordByDate(state) {
            return (date) => {
                const record = state.records.find((record) => record.date === date);
                if (record) {
                    // если уже есть запись с этой датой, возвращаем её
                    return record;
                }
                // иначе - возвращаем пустую запись, но не добавляем её в массив до действий пользователя с ней
                return {
                    date: date,
                    totalCalories: [0, 0, 0],
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
            this.fetchCurrentId();
        },
        async fetchSettings() {
            const storedSettings = localStorage.getItem('settings');
            if (storedSettings) {
                this.setSettings(JSON.parse(storedSettings));
            } else {
                localStorage.setItem('settings', JSON.stringify(this.settings));
            }
        },
        async fetchChosenDate() {
            const storedChosenDate = localStorage.getItem('chosenDate');
            if (storedChosenDate) {
                this.setChosenDate(JSON.parse(storedChosenDate));
            } else {
                localStorage.setItem('chosenDate', JSON.stringify(this.chosenDate));
            }
        },
        async fetchCurrentId() {
            const storedId = localStorage.getItem('currentId');
            if (storedId) {
                this.setCurrentId(JSON.parse(storedId));
            } else {
                localStorage.setItem('currentId', JSON.stringify(this.currentId));
            }
        },
        setCurrentId(payload) {
            this.currentId = payload;
            localStorage.setItem('currentId', JSON.stringify(this.currentId));
        },
        setChosenDate(payload) {
            this.chosenDate = payload;
            localStorage.setItem('chosenDate', JSON.stringify(this.chosenDate));
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
        editMeal(payload) {
            const record = this.records.find((record) => record.date === payload.date);
            switch (payload.type) {
                case 'breakfast': {
                    const eatenProduct = record.breakfast.find((product) => product.id === payload.eatenProductId);
                    eatenProduct.count = payload.count;
                    localStorage.setItem('records', JSON.stringify(this.records));
                    break;
                }
                case 'lunch': {
                    const eatenProduct = record.lunch.find((eatenProduct)=>eatenProduct.id === payload.eatenProductId)
                    eatenProduct.count = payload.count;
                    localStorage.setItem('records', JSON.stringify(this.records));
                    break;
                }
                case 'dinner': {
                    const eatenProduct = record.dinner.find((eatenProduct)=>eatenProduct.id === payload.eatenProductId)
                    eatenProduct.count = payload.count;
                    localStorage.setItem('records', JSON.stringify(this.records));
                    break;
                }
            }
        },
        addToMeal(payload) {
            let record = this.records.find((record) => record.date === payload.date);
            if (!record) {
                this.records.push({
                    date: payload.date,
                    totalCalories: [0, 0, 0],
                    breakfast: [],
                    lunch: [],
                    dinner: []
                });
                record = this.records.find((record) => record.date === payload.date);
            }
            switch (payload.type) {
                case 'breakfast': {
                    record.breakfast.push({
                        id: this.currentId,
                        productId: payload.productId,
                        count: payload.count
                    });
                    this.setCurrentId(this.currentId+1);
                    break;
                }
                case 'lunch': {
                    record.lunch.push({
                        id: this.currentId,
                        productId: payload.productId,
                        count: payload.count
                    });
                    this.setCurrentId(this.currentId+1);
                    break;
                }
                case 'dinner': {
                    record.dinner.push({
                        id: this.currentId,
                        productId: payload.productId,
                        count: payload.count
                    });
                    this.setCurrentId(this.currentId+1);
                    break;
                }
            }

        },
        deleteFromMeal(payload) {
            const record = this.recordByDate(payload.date);
            switch (payload.type) {
                case 'breakfast': {
                    const index = record.breakfast.findIndex(item => item.id === payload.id);
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
