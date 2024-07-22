


//villa_create_ApiCall

import axios from "../../utils/zedSoftadminAxios";

export const CreateApi = async(data,successfun) =>{
    console.log(data)
    try{
        const res = await axios.post("/villa/create",data);
        console.log(res)
        if(res.status === 201){
            successfun()
        }

    }catch(err){

    }

}