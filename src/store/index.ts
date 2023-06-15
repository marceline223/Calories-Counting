import {defineStore} from 'pinia'
import {Record} from "./store-types";

export const useRecordsStore = defineStore('records', {
    state: () => ({
        records: [
            {
                date: '2023-06-13',
                breakfast: [
                    {
                        id: 1,
                        count: 3
                    },
                    {
                        id: 2,
                        count: 1
                    },
                    {
                        id: 3,
                        count: 0.5
                    }
                ],
                lunch: [
                    {
                        id: 1,
                        count: 1
                    },
                    {
                        id: 5,
                        count: 1
                    }
                ],
                dinner: [
                    {
                        id: 1,
                        count: 2
                    },
                    {
                        id: 10,
                        count: 3.5
                    }
                ]
            },
            {
                date: '2023-06-12',
                breakfast: [
                    {
                        id: 5,
                        count: 1
                    }
                ],
                lunch: [
                    {
                        id: 4,
                        count: 2
                    },
                    {
                        id: 1,
                        count: 6
                    }
                ],
                dinner: [
                    {
                        id: 2,
                        count: 0.2
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
    actions: {},
})
