import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    Items,
    REQUEST_STATUS,
    setErrorMessage,
    setErrorPayload,
    setSuccessfulPayload
} from "../githubSlice";
import axios, {AxiosError, AxiosResponse} from 'axios'
import {BASE_URL, SLICE_NAME, TOTAL_ITEMS} from "./constants";

interface ResponseSuccess {
    items:Items[]
    total_count:number
}

interface ResponseError {
   documentation_url: string
   message: string
}

type ResponseGitHub = ResponseSuccess | ResponseError

const isSuccessResponse = (response: AxiosResponse<ResponseGitHub>):response is AxiosResponse<ResponseSuccess> => 'items' in response.data && response.status === 200

export const getItems = createAsyncThunk<void,number>(
    `${SLICE_NAME}/getItems`,
    async (nextPage,{dispatch,rejectWithValue}) => {
        try{
            const response= await axios.get<ResponseGitHub>(`${BASE_URL}&per_page=${TOTAL_ITEMS}&page=${nextPage}`)
            if(isSuccessResponse(response)){
                dispatch(setSuccessfulPayload(
                    {
                        totalPages:Math.floor(response.data.total_count / TOTAL_ITEMS),
                        items:response.data.items,
                        currentPage:nextPage,
                        requestStatus:REQUEST_STATUS.SUCCESS,
                    }
                ))
            } else {
                dispatch(setErrorPayload({requestStatus:REQUEST_STATUS.ERROR}))
            }
        } catch (e){
            const err = e as AxiosError<ResponseError>
            dispatch(setErrorMessage(err?.response?.data?.message || ''))
            return rejectWithValue(err.message)
        }
    }
)