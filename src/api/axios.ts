import axios, { AxiosError } from 'axios'

const API = axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL || '/', // if use predefined url
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 5000,
})

export const handleError = (
    message: string,
    data: any,
    status: number | undefined,
) => {
    return Promise.reject({ message, data, status })
}

API.interceptors.response.use(
    (response) => response,
    ({ message, response }: AxiosError<any>) => {
        return handleError(message, response?.data, response?.status)
    },
)

API.interceptors.request.use((config) => {
    // const token = ''    // get token from store
    // config.headers.Authorization = token ? `Bearer ${token}` : ''
    // config.baseURL = viewPropsStore().config.baseUrl || ''
    return config
})

export default API
