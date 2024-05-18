import { SELECT_CATEGORY, SET_MIN_PRICE, SET_MAX_PRICE, RESET_FILTERS } from '../action/categoryActions';

const initialCategoryState = {
    selectedCategory: null,
};

export const categoryReducerFilter = (state = initialCategoryState, action) => {
    switch (action.type) {
        case SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload,
            };
        case RESET_FILTERS:
            return {
                ...state,
                selectedCategory: null,
            };
        default:
            return state;
    }
};

const initialPriceState = {
    minPrice: 0,
    maxPrice: 50000,
};

export const priceReducer = (state = initialPriceState, action) => {
    switch (action.type) {
        case SET_MIN_PRICE:
            return {
                ...state,
                minPrice: action.payload,
            };
        case SET_MAX_PRICE:
            return {
                ...state,
                maxPrice: action.payload,
            };
        case RESET_FILTERS:
            return {
                ...state,
                minPrice: 0,
                maxPrice: 50000,
            };
        default:
            return state;
    }
};
