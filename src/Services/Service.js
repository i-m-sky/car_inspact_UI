import instance from "../http/axios";

export const PostApi = async(url,data)=>{
    try {
        let result = await instance.post(url,data)
            return result.data
    } catch (error) {
        if(error){
            return error
        }
    }
}

export const GetApi = async(url)=>{
    try {
        let result = await instance.get(url)
        return result.data;
    } catch (error) {
        if(error){
            return error
        }
    }
}