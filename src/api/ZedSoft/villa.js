


//villa_create_ApiCall

import { store } from "src/redux/store";
import axios from "../../utils/zedSoftadminAxios";
import { villaList } from "src/redux/slices/villaslice";

export const CreateApi = async (data, successfun) => {
    console.log(data)
    try {
        const res = await axios.post("/villa/create", data, {

            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        console.log(res)
        if (res.status === 201) {
            successfun()
        }

    } catch (err) {

    }

}



//getAlldata
export const getAllVillaApi = async () => {

    try {
        const res = await axios.get('/villa/getalldata', {
            headers: {
                "Content-Type": "application/json",
            }
        })
        console.log(res)

        if (res.status === 200) {
            store.dispatch(villaList({ data: res.data }))
        }
    } catch (err) {
        store.dispatch(villaList({ data: [] }))
    }

}