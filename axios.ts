import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import CircuitBreaker from './circuitBreaker';

const circuitBreaker = new CircuitBreaker(3, 60 * 1000)

const defaultConfig: AxiosInstance = {
    baseURL: 'https://api.example.com',
    timeout: 5 * 1000,
    headers: {
      'Content-Type': 'application/json',
    },
};

defaultConfig.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if(!circuitBreaker.allowRequest()) {
            return Promise.reject(new axios.Cancel('Circuit breaker is OPEN, request blocked'))
        }
        return config
    }
)
defaultConfig.interceptors.response.use(
    (response) => {
        circuitBreaker.onSuccess()
        return response
    },
    (error) => {
        if(!axios.isCancel(error)){ // It's not a cancel, it's a server error
            circuitBreaker.onFailure()
        }
        return Promise.reject(error)
    }
)
export default defaultConfig

