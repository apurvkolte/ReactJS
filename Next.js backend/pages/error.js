import React, { useMemo } from 'react';
import withUserAuth from './withUserAuth';
const Component = withUserAuth(() => import('../components/cart/OrderError'));

const ComponentWrapper = () => {
    const MemoizedComponent = useMemo(() => <Component />, []);

    return MemoizedComponent;
};

export default React.memo(ComponentWrapper);