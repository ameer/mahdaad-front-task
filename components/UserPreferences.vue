<template>
    <div :class="[theme, fontSize]">
        <h2>User Preferences</h2>

        <div>
            <p>Theme:</p>
            <button @click="theme = 'light'">Light</button>
            <button @click="theme = 'dark'">Dark</button>
        </div>
        <div>
            <p>Font Size:</p>
            <button @click="fontSize = 'small'">Small</button>
            <button @click="fontSize = 'medium'">Medium</button>
            <button @click="fontSize = 'large'">Large</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import {useUserPreferences} from '@/composables/useUserPreferences'

const {theme, fontSize} = useUserPreferences()
</script>
<style>
    
</style>