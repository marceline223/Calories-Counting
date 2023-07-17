import {createRouter, createWebHistory} from 'vue-router'

import MainPage from "../components/MainPage.vue";
import StatisticPage from "../components/StatisticPage.vue";
import ProductListPage from "../components/ProductListPage.vue";
import SettingsPage from "../components/SettingsPage.vue"

const routes = [
    {
        path: '/',
        name: 'Main',
        component: MainPage,
        alias: '/main'
    },
    {
        path: '/statistic',
        name: 'Statistic',
        component: StatisticPage
    },
    {
        path: '/product-list',
        name: 'Product List',
        component: ProductListPage
    },
    {
        path: '/settings',
        name: 'Settings',
        component: SettingsPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router
