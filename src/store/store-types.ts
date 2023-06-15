export interface Record {
    date: Date,
    breakfast: Meal,
    lunch: Meal,
    dinner: Meal
}

export interface Meal {
    products: Product[]
}

export interface Product {
    id: number,
    count: number
}
