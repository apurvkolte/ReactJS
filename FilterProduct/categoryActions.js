// src/actions/categoryActions.js
export const SELECT_CATEGORY = 'SELECT_CATEGORY';

export const selectCategory = (category) => ({
    type: SELECT_CATEGORY,
    payload: category,
});


// src/actions/priceActions.js
export const SET_MIN_PRICE = 'SET_MIN_PRICE';
export const SET_MAX_PRICE = 'SET_MAX_PRICE';
export const RESET_FILTERS = 'RESET_FILTERS ';

export const setMinPrice = (minPrice) => ({
    type: SET_MIN_PRICE,
    payload: minPrice,
});

export const setMaxPrice = (maxPrice) => ({
    type: SET_MAX_PRICE,
    payload: maxPrice,
});

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
                maxPrice: 1000,
            };
        default:
            return state;
    }
};

export const resetFilters = () => ({
    type: RESET_FILTERS,
});
