// react
import { Fragment, useEffect } from 'react';

// third-party
import classNames from 'classnames';
import { connect, useDispatch, useSelector } from 'react-redux';

// application
import AppLink from '../shared/AppLink';
import { ICategoryFilter } from '../../interfaces/filter';
import { useRouter } from 'next/router';

import { allCategory } from '../../store/action/productActions';
import { selectCategory as selectCategoryAction } from '../../store/action/categoryActions';



function FilterCategory() {
    const router = useRouter();
    const dispatch = useDispatch();

    const categories = useSelector(state => state.allCategory.category);

    useEffect(() => {
        dispatch(allCategory());
    }, [dispatch]);

    const allItemClasses = classNames('filter-categories__item', {
        'filter-categories__item--current': selectedCategory === null,
    });

    const categoriesList = categories.map((category) => {
        const itemClasses = classNames('filter-categories__item', {
            'filter-categories__item--current': selectedCategory === category.category,
        });


        return (
            <Fragment key={category.id}>
                <li className={itemClasses} onClick={() => selectCategory(category.category)}>
                    {category.category}
                </li>
            </Fragment>
        );
    });

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                <li className={allItemClasses} onClick={() => selectCategory(null)}>
                    ALL
                </li>
                {categoriesList}
            </ul>
        </div>
    );
}

const mapStateToProps = (state) => ({
    selectedCategory: state.category.selectedCategory,
});

const mapDispatchToProps = {
    selectCategory: selectCategoryAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterCategory);
