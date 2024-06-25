import React, { useMemo } from 'react';
import withAdminAuth from '../../withAdminAuth';
const Component = withAdminAuth(() => import('../../../components/admin/Report'));

const ComponentWrapper = () => {
    const MemoizedComponent = useMemo(() => <Component />, []);

    return MemoizedComponent;
};

export default React.memo(ComponentWrapper);

