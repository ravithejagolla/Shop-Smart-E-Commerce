import axios from 'axios'
const baseurl="https://api.escuelajs.co/api/v1"

export const getAllitems=async()=>{
    const url=`${baseurl}/products`
    try{
        const {data}=await axios.get(url)
        console.log(data)
        return data
    }catch(e){
        return e
    }

}