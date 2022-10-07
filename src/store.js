import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import cubeData from './data.json';


const initialState = {
    cubeData,
    visibleItems: cubeData.map(i => i.item),
}


export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        loadData: (state, action) => ({
            ...state,
            cubeData: action.payload,
            visibleItems: action.payload.map(item => item.item)
        }),
        toggleVisible: (state, action) => ({
            ...state,
            visibleItems: state.visibleItems.includes(action.payload)
                ? state.visibleItems.filter(item => item !== action.payload)
                : [...state.visibleItems, action.payload]
        })
    }
})


export const {loadData, toggleVisible} = counterSlice.actions


export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
    },
})
