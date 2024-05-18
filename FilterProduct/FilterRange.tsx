// react
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

// third-party
import InputRange from 'react-input-range';
import { connect, useDispatch, useSelector } from 'react-redux';


// application
import CurrencyFormat from '../shared/CurrencyFormat';

import { setMinPrice, setMaxPrice } from '../../store/action/categoryActions';



function FilterRange() {

    const dispatch = useDispatch();
    const { minPrice, maxPrice } = useSelector(state => state.priceFilter);

    const handlePriceChange = (value) => {
        dispatch(setMinPrice(value.min));
        dispatch(setMaxPrice(value.max));
    };



    return useMemo(() => (
        <div className="filter-price">
            <div className="filter-price__slider" dir="ltr">
                <InputRange
                    minValue={0}
                    maxValue={50000}
                    value={{ min: minPrice, max: maxPrice }}
                    step={1}
                    onChange={handlePriceChange}
                />
            </div>
            <div className="filter-price__title">
                Price:
                {' '}
                <span className="filter-price__min-value"><CurrencyFormat value={minPrice} /></span>
                {' – '}
                <span className="filter-price__max-value"><CurrencyFormat value={maxPrice} /></span>
            </div>
        </div>
    ), [min, max, from, to, minPrice, maxPrice, handlePriceChange]);
}

export default FilterRange;
