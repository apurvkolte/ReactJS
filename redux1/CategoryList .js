// src/components/CategoryList.js
import React from 'react';
import { connect } from 'react-redux';
import { selectCategory } from '../actions/categoryActions';

const CategoryList = ({ categories, selectedCategory, selectCategory }) => {
    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {categories.map((category) => {
                    const itemClasses = category.category === selectedCategory ? 'selected' : '';
                    return (
                        <li
                            key={category.id}
                            className={itemClasses}
                            onClick={() => selectCategory(category.category)}
                        >
                            {category.category}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const mapStateToProps = (state) => ({
    categories: state.category.categories,
    selectedCategory: state.category.selectedCategory,
});

const mapDispatchToProps = {
    selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);



// import { useDispatch, useSelector } from 'react-redux'
//const { selectedCategory } = useSelector(state => state.categoryfilter);


// or
//  const dispatch = useDispatch();
// const handleReset = () => {
//     dispatch(selectCategory("AngularCutter"));
// };
