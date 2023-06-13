import { afterAll, afterEach, beforeAll } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const initServer = (
    endpoints: {
        method: 'get' | 'post' | 'patch' | 'put' | 'delete'
        url: string
        res?: Record<string, any>
    }[]
) => {
    // const reqReceived = new Map()
    const server = setupServer(
        ...endpoints.map((endpoint) =>
            rest[endpoint.method](endpoint.url, async (req, res, ctx) => {
                // const old = reqReceived.get(endpoint.url)
                // if (Boolean(old)) {
                //     old.push(new Date().getTime())
                //     reqReceived.set(endpoint.url, old)
                // } else {
                //     reqReceived.set(endpoint.url, [new Date().getTime()])
                // }

                let response = endpoint.res || {}
                if (endpoint.method === 'patch' && endpoint.url === '/api/updateMessage') {
                    const requestMsg = await req.json()
                    response = requestMsg
                }

                console.log('sending response back:', endpoint.url)
                return res(ctx.status(200), ctx.json(response))
            })
        )
    )

    // // polling promise
    // const requestReceived = (url: string) =>
    //     new Promise((resolve, rej) => {
    //         let count = 0
    //         const interval = setInterval(() => {
    //             count++
    //             if (reqReceived.has(url)) {
    //                 clearInterval(interval)
    //                 const res = reqReceived.get(url)
    //                 const oldest = res.shift()
    //                 res.length > 0 ? reqReceived.set(url, res) : reqReceived.delete(url)
    //                 resolve(oldest)
    //             }

    //             if (count > 10) {
    //                 clearInterval(interval)
    //                 rej('tomeout 500ms')
    //             }
    //         }, 50)
    //     })

    return {
        server,
        // requestReceived
    }
}

const { server,
    // requestReceived
} = initServer([
    {
        method: 'get',
        url: '/api/getMessage',
        res: { message: 'get succuess' }
    },
    {
        method: 'patch',
        url: '/api/updateMessage'
        // res: { message: 'update success' }
    }
])

beforeAll(() => {
    setActivePinia(createPinia())
    // polyfill or remove  window method
    window.open = (() => {}) as any
    server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// export const afterRequestReceived = requestReceived
