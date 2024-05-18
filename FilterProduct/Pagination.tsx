// third-party
import classNames from 'classnames';

// application
import ArrowRoundedLeft8x13Svg from '../../svg/arrow-rounded-left-8x13.svg';
import ArrowRoundedRight8x13Svg from '../../svg/arrow-rounded-right-8x13.svg';

export interface PaginationProps {
    siblings?: number;
    current?: number;
    total?: number;
    onPageChange?: (page: number) => void;
}

function Pagination(props: PaginationProps) {
    const {
        siblings = 1,
        current = 1,
        total = 1,
        onPageChange,
    } = props;

    const setPage = (value: number) => {
        if (value < 1 || value > total || value === current) {
            return;
        }

        if (onPageChange) {
            onPageChange(value);
        }
    };

    const getPages = () => {
        const pages = [];
        const min = Math.max(1, current - siblings - Math.max(0, siblings - total + current));
        const max = Math.min(total, min + siblings * 2);

        for (let i = min; i <= max; i += 1) {
            pages.push(i);
        }

        return pages;
    };

    const firstLinkClasses = classNames('page-item', {
        disabled: current <= 1,
    });
    const lastLinkClasses = classNames('page-item', {
        disabled: current >= total,
    });

    const pages = getPages().map((page, index) => {
        const classes = classNames('page-item', {
            active: page === current,
        });

        return (
            <li key={index} className={classes}>
                <button type="button" className="page-link" onClick={() => setPage(page)}>
                    {page}
                    {page === current && <span className="sr-only">(current)</span>}
                </button>
            </li>
        );
    });

    return (
        <ul className="pagination justify-content-center">
            <li className={firstLinkClasses}>
                <button
                    type="button"
                    className="page-link page-link--with-arrow"
                    aria-label="Previous"
                    onClick={() => setPage(current - 1)}
                >
                    <ArrowRoundedLeft8x13Svg className="page-link__arrow page-link__arrow--left" aria-hidden="true" />
                </button>
            </li>
            {pages}
            <li className={lastLinkClasses}>
                <button
                    type="button"
                    className="page-link page-link--with-arrow"
                    aria-label="Next"
                    onClick={() => setPage(current + 1)}
                >
                    <ArrowRoundedRight8x13Svg className="page-link__arrow page-link__arrow--right" aria-hidden="true" />
                </button>
            </li>
        </ul>
    );
}

export default Pagination;
