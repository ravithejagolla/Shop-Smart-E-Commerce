import axios from 'axios'
const baseurl = `${import.meta.env.VITE_BACKEND_URL}/product`

export const getAllitems = async () => {
    const url = `${baseurl}/getAllProduct`
    try {
        const { data } = await axios.get(url)
        console.log(data.productFetch)
        return data.productFetch
    } catch (e) {
        return e
    }
}