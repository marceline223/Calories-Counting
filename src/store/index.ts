import {defineStore} from 'pinia'
import {DayRecord, ProductInfo} from "./store-types";
import moment from "moment";

export const useRecordsStore = defineStore('recordsStore', {
    state: () => ({
        records: [] as DayRecord,
        settings: {
            normOfCalories: 0,
            weight: null,
            height: null,
            age: null,
            gender: 'female',
            activity: 1.2
        },
        currentId: 0,
        chosenDate: null,
        chosenDatesForStatistic: {
            first: null,
            second: null
        }
    }),
    getters: {
        recordByDate(state) {
            return (date) => {
                const record = state.records.find((record) => moment(record.date).isSame(date, 'd'));
                if (record) {
                    // если уже есть запись с этой датой, возвращаем её
                    return record;
                }
                // иначе - возвращаем пустую запись, но не добавляем её в массив до действий пользователя с ней
                return {
                    date: date,
                    totalCalories: [0, 0, 0],
                    proteins: [0, 0, 0],
                    carbs: [0, 0, 0],
                    fats: [0, 0, 0],
                    breakfast: [],
                    lunch: [],
                    dinner: []
                }
            }
        }
    },
    actions: {
        fetchRecordsStore() {
          this.fetchRecords();
          this.fetchCurrentId();
          this.fetchChosenDatesForStatistic();
          this.fetchSettings();
          this.fetchChosenDate();
        },
        fetchRecords() {
            const storedRecords = localStorage.getItem('records');
            if (storedRecords) {
                this.setRecords(JSON.parse(storedRecords));
            } else {
                localStorage.setItem('records', JSON.stringify(this.records));
            }
        },
        fetchSettings() {
            const storedSettings = localStorage.getItem('settings');
            if (storedSettings) {
                this.setSettings(JSON.parse(storedSettings));
            } else {
                localStorage.setItem('settings', JSON.stringify(this.settings));
            }
        },
        fetchChosenDate() {
            const storedChosenDate = localStorage.getItem('chosenDate');
            if (storedChosenDate) {
                this.setChosenDate(JSON.parse(storedChosenDate));
            } else {
                localStorage.setItem('chosenDate', JSON.stringify(this.chosenDate));
            }
        },
        fetchChosenDatesForStatistic() {
            const storedDates = localStorage.getItem('chosenDatesForStatistic');
            if (storedDates) {
                this.setChosenDatesForStatistic({
                    type: 'both',
                    dates: JSON.parse(storedDates)
                });
            } else {
                localStorage.setItem('chosenDatesForStatistic', JSON.stringify(this.chosenDatesForStatistic));
            }
        },
        fetchCurrentId() {
            const storedId = localStorage.getItem('recordsCurrentId');
            if (storedId) {
                this.setCurrentId(JSON.parse(storedId));
            } else {
                localStorage.setItem('recordsCurrentId', JSON.stringify(this.currentId));
            }
        },
        setCurrentId(payload) {
            this.currentId = payload;
            localStorage.setItem('recordsCurrentId', JSON.stringify(this.currentId));
        },
        setChosenDatesForStatistic(payload) {
            switch (payload.type) {
                case 'first':
                    this.chosenDatesForStatistic.first = moment(payload.date)
                    break;
                case 'second':
                    this.chosenDatesForStatistic.second = moment(payload.date);
                    break;
                default:
                    this.chosenDatesForStatistic.first = moment(payload.dates.first);
                    this.chosenDatesForStatistic.second = moment(payload.dates.second);
                    break;
            }

            localStorage.setItem('chosenDatesForStatistic', JSON.stringify(this.chosenDatesForStatistic));
        },
        setChosenDate(payload) {
            this.chosenDate = moment(payload);
            localStorage.setItem('chosenDate', JSON.stringify(moment(this.chosenDate)));
        },
        setRecords(payload) {
            this.records = payload;
            localStorage.setItem('records', JSON.stringify(this.records));
        },
        setSettings(payload) {
            this.settings = payload;
            localStorage.setItem('settings', JSON.stringify(this.settings));
        },
        setTotal(payload) {
            const record = this.recordByDate(payload.date);

            record.totalCalories[payload.index] = payload.calories;
            record.fats[payload.index] = payload.fats;
            record.carbs[payload.index] = payload.carbs;
            record.proteins[payload.index] = payload.proteins;

            localStorage.setItem('records', JSON.stringify(this.records));
        },
        editMeal(payload) {
            const record = this.records.find((record) => moment(record.date).isSame(payload.date, 'd'));
            switch (payload.type) {
                case 'breakfast': {
                    const eatenProduct = record.breakfast.find((product) => product.id === payload.eatenProductId);
                    eatenProduct.count = payload.count;
                    localStorage.setItem('records', JSON.stringify(this.records));
                    break;
                }
                case 'lunch': {
                    const eatenProduct = record.lunch.find((eatenProduct) => eatenProduct.id === payload.eatenProductId)
                    eatenProduct.count = payload.count;
                    localStorage.setItem('records', JSON.stringify(this.records));
                    break;
                }
                case 'dinner': {
                    const eatenProduct = record.dinner.find((eatenProduct) => eatenProduct.id === payload.eatenProductId)
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
                    proteins: [0, 0, 0],
                    carbs: [0, 0, 0],
                    fats: [0, 0, 0],
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
                    this.setCurrentId(this.currentId + 1);
                    break;
                }
                case 'lunch': {
                    record.lunch.push({
                        id: this.currentId,
                        productId: payload.productId,
                        count: payload.count
                    });
                    this.setCurrentId(this.currentId + 1);
                    break;
                }
                case 'dinner': {
                    record.dinner.push({
                        id: this.currentId,
                        productId: payload.productId,
                        count: payload.count
                    });
                    this.setCurrentId(this.currentId + 1);
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
    actions: {
        addProduct(payload) {
            this.products.push({
                id: this.currentId,
                name: payload.name,
                calories: payload.calories,
                fats: payload.fats,
                carbs: payload.carbs,
                proteins: payload.proteins
            });
            this.setCurrentId(this.currentId + 1);
            localStorage.setItem('products', JSON.stringify(this.products));
        },
        fetchCurrentId() {
            const storedId = localStorage.getItem('productsCurrentId');
            if (storedId) {
                this.setCurrentId(JSON.parse(storedId));
            } else {
                localStorage.setItem('productsCurrentId', JSON.stringify(this.currentId));
            }
        },
        setCurrentId(payload) {
            this.currentId = payload;
            localStorage.setItem('productsCurrentId', JSON.stringify(this.currentId));
        },
        async fetchProductsStore() {
            const storedProductList = localStorage.getItem('products');
            if (!storedProductList) {
                //если данных нет в localStorage, загружаем из файла
                try {
                    const response = await fetch('src/assets/food_base.json');
                    const productList = await response.json();
                    this.products = productList;
                    this.setCurrentId(productList.length);

                    localStorage.setItem('products', JSON.stringify(productList));
                } catch (error) {
                    console.error('Failed to load products list: ', error);
                }
            } else {
                this.products = JSON.parse(storedProductList);
            }
            this.fetchCurrentId();
        }
    }
});
