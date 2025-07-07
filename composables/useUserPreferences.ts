import {ref, watch} from 'vue'

const THEME_KEY = 'user-theme'
const FONT_SIZE_KEY = 'user-font-size'

export function useUserPreferences(){
    const theme = ref<'light' | 'dark'>(localStorage.getItem(THEME_KEY) as 'light' | 'dark' || 'light') // Defaults to light
    const fontSize = ref<'small' | 'medium' | 'large'>(localStorage.getItem(FONT_SIZE_KEY) as 'small' | 'medium' | 'large' || 'medium') // defaults to medium

    // Watchers to stay sync with LS

    watch(theme, (newTheme: string) => {
        localStorage.setItem(THEME_KEY, newTheme)
    })
    watch(fontSize, (newSize: string) => {
        localStorage.setItem(FONT_SIZE_KEY, newSize)
    })

    return {
        theme,
        fontSize
    }
}