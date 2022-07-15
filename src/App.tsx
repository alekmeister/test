import React, {useEffect} from 'react';
import './App.css';
import {useAppDispatch, useAppSelector} from "./store/store";
import {getItems} from "./store/actionCreators/getItems";
import {MAX_SEARCH_RESULT} from "./store/actionCreators/constants";

const DELAY_LOAD_DATA = 5000

function App() {
    const dispatch = useAppDispatch()

    const {currentPage,requestId,items,totalPages,failedMessage} = useAppSelector(state=>state)

    useEffect(()=>{
        const nextPage = currentPage + 1
        const resetTimer = (!Number.isNaN(totalPages) && nextPage > totalPages) || failedMessage === MAX_SEARCH_RESULT

        const timer = setTimeout(()=>{
            dispatch(getItems(nextPage))
        },DELAY_LOAD_DATA)

        if(resetTimer) {
            clearTimeout(timer)
            return
        }

        return () => {
            clearTimeout(timer)
        }

    },[currentPage,requestId])

  return (
    <div className="App">
       <div>
           <ul>
               {items.map((el,idx)=><li key={`${el}-${idx}`}>{el.name}</li>)}
           </ul>
       </div>
    </div>
  );
}

export default App;
