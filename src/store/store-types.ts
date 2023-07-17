export interface Record {
    date: Date,
    totalCalories: number[],
    proteins: number[],
    carbs: number[],
    fats: number[],
    breakfast: Meal,
    lunch: Meal,
    dinner: Meal
}

export interface Meal {
    products: EatenProduct[]
}

export interface EatenProduct {
    id: number,
    count: number
}

export interface ProductInfo {
    id: number,
    name: string,
    calories: string,
    proteins: string,
    fats: string,
    carbs: string
}
