


//villa_create_ApiCall

import { store } from "src/redux/store";
import axios from "../../utils/zedSoftadminAxios";
import { singleViewOfVillastate, villaList } from "src/redux/slices/villaslice";

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


// singleViewByID
export const singleViewofVillaByID = async (id) => {

    try {
        const res = await axios.post('villa/singleviewbyId', { id: id }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (res.status === 200) {
            store.dispatch(singleViewOfVillastate({ data: res.data }))
        }

    } catch (err) {
        store.dispatch(singleViewOfVillastate({ data: [] }))
    }

}


//updateVilla 
export const UpdateVillaByIDApiCall = async (data, successfun) => {

    console.log(data)
    try {
        const res = await axios.put("/villa/updatevilla", data, {

            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        console.log(res)
        if (res.status === 200) {
            successfun()
        }

    } catch (err) {
        window.alert("SOMETHING WRONG>>>>")
    }


}