<template>
    <div>
        <div v-if="isLoading">
            Loading user data...
        </div>
        <div v-else-if="error">
            {{ error }}
        </div>
        <div v-else-if="userData">
            <h3>User: {{ userData.name }}</h3>
            <h4>Email: {{ userData.email }}</h4>
        </div>
        <div v-else>Please select a user to view their data.</div>
    </div>
</template>
<script setup lang="ts">
import {useUserDataFetcher} from '@/composables/useUserDataFetcher'

const {
        userId,
        userData,
        isLoading,
        error,
        fetchUserData
    } = useUserDataFetcher()

// Set a userId (from prop or route params or user input)

userId.value = 'someUserId'

</script>
<style>
    
</style>