import React, { useMemo } from 'react';
import withAdminAuth from '../../../withAdminAuth';
const Component = withAdminAuth(() => import('../../../../components/admin/OrdersReturnList'));
const ComponentWrapper = () => {
    const MemoizedComponent = useMemo(() => <Component />, []);
    return MemoizedComponent;
};

export default React.memo(ComponentWrapper);