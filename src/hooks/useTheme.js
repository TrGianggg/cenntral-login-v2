import {computed, onMounted, ref} from 'vue';
import {useThemeStore} from "@/stores/themeStore";

export function useTheme() {
    const isDark = ref(false);
    const store = useThemeStore()
    const initTheme = () => {
        const VITE_BASE_IS_DARK_THEME = import.meta.env.VITE_BASE_IS_DARK_THEME;
        const defaultTheme = VITE_BASE_IS_DARK_THEME === '1' ? 'dark' : 'light';
        const theme = localStorage.getItem('theme') || defaultTheme;
        isDark.value = theme === 'dark';
        setTheme();
    }
    const setTheme = () => {
        store.setTheme(isDark.value)
        if (isDark.value) {
            document.documentElement.classList.add('dark-theme')
            document.documentElement.classList.remove('light-theme')
        } else {
            document.documentElement.classList.remove('dark-theme')
            document.documentElement.classList.add('light-theme')
        }
    }
    const toggleTheme = () => {
        isDark.value = !isDark.value
        setTheme();
    }

    onMounted(() => {
        initTheme()
    })

    return {
        toggleTheme,
        initTheme
    };
}