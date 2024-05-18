// src/reducers/categoryReducer.js
import { SELECT_CATEGORY } from '../actions/categoryActions';

const initialState = {
    selectedCategory: null,
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload,
            };
        default:
            return state;
    }
};

export default categoryReducer;
