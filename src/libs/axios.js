import axios from 'axios'

const CancelToken = axios.CancelToken

class HttpRequest {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {}
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            /*if (this.queue[url]) {
                this.queue[url]('取消重复请求')
            }
            config.cancelToken = new CancelToken(c => {
                this.queue[url] = c
            })*/
            
            // get 方法中可以添加Content-Type
            if (config.method === 'get') {
                config.data = true
            }
            return config
        }, error => {
            return Promise.reject(error).catch(e => {
                console.error(e)
            })
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            if (res && res.status !== 200) {
                // todo error
                return Promise.reject(res).catch(e => {
                    console.error(e)
                })
            } else {
                const { data, status } = res
                return data
            }
        }, error => {
            this.destroy(url)
            // todo error
            return Promise.reject(error).catch(e => {
                console.error(e)
            })
        })
    }
    request(options) {
        const instance = axios.create({})
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest
