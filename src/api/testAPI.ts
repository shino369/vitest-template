import API from './axios'

interface MessageResponse {
    message: string
}

export const getMessage = async () => {
    const res = await API.get<MessageResponse>(
        '/api/getMessage',
    )
    return res.data
}

export const updateMessage = async (msg: string) => {
    const res = await API.patch<MessageResponse>('/api/updateMessage', {
        message: msg,
    })
    return res.data
}
