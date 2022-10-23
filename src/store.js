import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import cubeData from './data.json';
import {buildFigureSelector} from "./components/Constructor/Solver";


// export const COLS = 3;
// export const ROWS = 3;

export const COLS = 5;
export const ROWS = 5;

const slice = counts => Array(counts).fill(false);
const figure = counts => [slice(counts)]


const initialState = {
    // cubeData,
    // visibleItems: cubeData.map(i => i.item),
    cubeData: null,
    visibleItems: null,
    fired: false,
    // cols: null,
    // rows: null,
    cols: COLS,
    view: false,
    rows: ROWS,
    figure: 0,
    currentFigure: 0,
    currentSlice: 0,
    solverFigures: null,
    // figures: null
    figures: [figure(COLS * ROWS)],
    solutions: [],
    solutionsState: {},
    runBuild: false
}


export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setSlice: (state, action) => ({
            ...state,
            currentSlice: action.payload
        }),
        toggleFired: state => ({
            ...state,
            fired: !state.fired
        }),
        setView: (state, action) => ({
            ...state,
            view: !!action.payload
        }),
        addSlice: state => ({
            ...state,
            currentSlice: state.figures[state.currentFigure].length,
            figures: state.figures.map((figure, pos) => pos !== state.currentFigure
                ? figure
                : [
                    ...figure, slice(state.cols * state.rows)
                ]
            )
        }),
        setSize: (state, action) => ({
            ...state,
            cols: action.payload,
            rows: action.payload,
            figures: [figure(action.payload * action.payload)]
        }),
        addFigure: state => ({
            ...state,
            currentFigure: state.figures.length,
            figures: [
                ...state.figures, figure(state.rows * state.cols)
            ],
            currentSlice: 0
        }),
        removeCurrentSlice: (state, action) => ({
            ...state,
        }),
        removeFigure: (state, action) => ({
            ...state
        }),
        tapCell: (state, action) => ({
            ...state,
            figures: state.figures.map((figure, pos) => (pos === state.currentFigure)
                ? figure.map((slice, slicePos) => slicePos !== state.currentSlice ? slice :
                    slice.map((cell, cellPos) => (cellPos === action.payload) ? !cell : cell)
                )
                : figure
            )
        }),
        loadData: (state, action) => ({
            ...state,
            cubeData: action.payload,
            view: true,
            visibleItems: action.payload.map(item => item.item)
        }),
        toggleVisible: (state, action) => ({
            ...state,
            visibleItems: state.visibleItems.includes(action.payload)
                ? state.visibleItems.filter(item => item !== action.payload)
                : [...state.visibleItems, action.payload]
        }),
        setFigure: (state, action) => ({
            ...state,
            currentFigure: action.payload,
            currentSlice: 0
        }),
        addSolutions: (state, action) => ({
            ...state,
            solutions: [...state.solutions, action.payload]
        }),
        solutionsSetState: (state, action) => ({
            ...state, solutionsState: {
                ...state.solutionsState, ...action.payload
            }
        }),
        runBuild: (state, action) => ({
            ...state,
            build: true,
            solutions: [],
            solutionsState: {},
            solverFigures: action.payload || buildFigureSelector({counter: state})
        }),
        setBuild: (state, action) => ({
            ...state,
            build: action.payload
        })
    }
})


export const {
    loadData, toggleVisible, tapCell,
    addSlice, setSlice, toggleFired,
    addFigure, setFigure, setSize,
    addSolutions, solutionsSetState,
    runBuild, setBuild, setView
} = counterSlice.actions


export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
    },
})
