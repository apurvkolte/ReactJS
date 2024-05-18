// react

import { connect, useDispatch, useSelector } from 'react-redux';

import { resetFilters } from '../../store/action/categoryActions';


function WidgetFilters() {

    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(resetFilters());
    };


    return (
        <div className="widget-filters__actions d-flex mb-n2">
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleReset}
            >
                Reset
            </button>
        </div>
    );
}

export default WidgetFilters;
