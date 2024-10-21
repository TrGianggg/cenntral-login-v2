import { defineStore } from 'pinia'
import { store } from './index.js'
const VITE_BASE_IS_DARK_THEME = import.meta.env.VITE_BASE_IS_DARK_THEME;
const defaultTheme = VITE_BASE_IS_DARK_THEME === '1';
export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkStore: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : defaultTheme
    }),
    actions: {
        setTheme(isDark) {
            this.isDarkStore = isDark
            localStorage.setItem('theme', isDark ? 'dark' : 'light')
        }
    }
})

export function useThemeStoreWithOut() {
    return useThemeStore(store)
}
