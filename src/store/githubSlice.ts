import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {getItems} from "./actionCreators/getItems";
import {SLICE_NAME} from "./actionCreators/constants";

export enum REQUEST_STATUS {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    LOADING = 'LOADING'
}

export interface Items {
    name: string
}

export interface gitHubSliceState {
    currentPage:number,
    items: Items[]
    requestStatus:REQUEST_STATUS
    requestId:number,
    totalPages:number
    failedMessage:string
}

export interface SuccessfulPayload  {
    totalPages:gitHubSliceState['totalPages']
    items:gitHubSliceState['items']
    currentPage:gitHubSliceState['currentPage']
    requestStatus:gitHubSliceState['requestStatus'],
}

const initialState: gitHubSliceState = {
    currentPage:0,
    items:[],
    requestStatus:REQUEST_STATUS.PENDING,
    requestId:0,
    totalPages:NaN,
    failedMessage:''
}


export const gitHubSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setSuccessfulPayload(state,action:PayloadAction<SuccessfulPayload>){
            const {currentPage,totalPages,requestStatus,items} = action.payload
            state.items = [...state.items,...items]
            state.totalPages = totalPages
            state.currentPage = currentPage
            state.requestStatus = requestStatus
        },
        setErrorPayload(state,action:PayloadAction<{requestStatus:REQUEST_STATUS}>){
            state.requestId += 1
            state.requestStatus = action.payload.requestStatus;
        },
        setErrorMessage(state,action:PayloadAction<string>){
            state.failedMessage = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getItems.pending, (state) => {
            state.requestStatus = REQUEST_STATUS.LOADING;
        });
        builder.addCase(getItems.rejected, (state) => {
            state.requestId += 1
            state.requestStatus = REQUEST_STATUS.ERROR;
        });
    },
})
export const {setErrorMessage,setSuccessfulPayload,setErrorPayload} = gitHubSlice.actions
export default gitHubSlice.reducer