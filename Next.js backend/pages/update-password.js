import React, { useMemo } from 'react';
import withUserAuth from './withUserAuth';
const Component = withUserAuth(() => import('../components/user/UpdatePassword'));

const ComponentWrapper = () => {
    const MemoizedComponent = useMemo(() => <Component />, []);

    return MemoizedComponent;
};

export default React.memo(ComponentWrapper);