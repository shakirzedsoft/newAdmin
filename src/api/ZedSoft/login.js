
import { store } from "src/redux/store";
import axios from "../../utils/zedSoftadminAxios"
import { login } from "src/redux/slices/checkout";

//LoginApi
export const LoginApi = async (data) => {
    console.log(data)
    try {

        const res = await axios.post('/auth/login/admin', data);
        console.log(res)

        localStorage.setItem('access_token',res?.data?.token)
        localStorage.setItem('role',res?.data?.role)

        store.dispatch(login({loginData:res.data,isLogged:true}))

    } catch (err) {

    }


}