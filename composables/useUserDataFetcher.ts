import {ref, watch} from 'vue'
import axios, {AxiosError} from 'axios'

// Type Definition

interface UserData {
    id: string
    name: string
    email: string
}

const userCache = new Map<string, UserData>()

export function useUserDataFetcher(){
    const userId = ref<string | null>(null)
    const userData = ref<UserData | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    let currentAbortController: AbortController | null = null

    const fetchUserData = async (id: string) => {
        error.value = null

        // If user in memory cache
        if(userCache.has(id)) {
            userData.value = userCache.get(id)
            console.log(`Loaded user ${id}`)
            return
        }
        if(currentAbortController && currentAbortController){
            currentAbortController.abort()
            console.log('Previous request cancelled.')
        }
        currentAbortController = new AbortController()
        const signal = currentAbortController.signal

        isLoading.value = true
        userData.value = null

        try {
            console.log(`Fetching data for user ${id}...`)
            const response = await axios.get<UserData>(`https://api.example.com/users/${id}`, {signal})

            if(!signal.aborted){
                userData.value = response.data
                userCache.set(id, response.data)
                console.log(`Cached user ${id}`)
            }
        } catch (err) {
            if(!axios.isCancel(err)) {
                const axiosError = err as AxiosError
                error.value = `Failed to load user ${id}`
                console.error(error.value)
            }
        } finally {
            isLoading.value = false
            currentAbortController = null
        }
    }

    // Add watcher to detect userId change

    watch(userId, (newId) => {
        if(newId) {
            fetchUserData(newId)
        } else {
            userData.value = null
            isLoading.value = false
            error.value = null
            if(currentAbortController){
                currentAbortController.abort()
                currentAbortController = null
            }
        }
    }, {immediate: true})


    return {
        userId,
        userData,
        isLoading,
        error,
        fetchUserData
    }
}