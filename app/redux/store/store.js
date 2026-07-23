import { configureStore } from "@reduxjs/toolkit";
// import questionSlice from "../reducers/question.slicer";
// import answerSlice from "../reducers/answer.slicer";
import themeReducer from "../reducers/themeSlice";


const store = configureStore({
    reducer: {
        // question: questionSlice,
        // answer: answerSlice,
        theme: themeReducer,
    },
});

export default store;