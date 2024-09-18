import {createRouter, createWebHistory} from 'vue-router'

import MainPage from "../pages/MainPage.vue";
import StatisticPage from "../pages/StatisticPage.vue";
import ProductListPage from "../pages/ProductListPage.vue";
import SettingsPage from "../pages/SettingsPage.vue"

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
