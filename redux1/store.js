// src/store.js
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import categoryReducer from './reducers/categoryReducer';

const rootReducer = combineReducers({
    category: categoryReducer,
});

const store = createStore(rootReducer);

export default store;
