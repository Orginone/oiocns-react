import React, { useEffect } from 'react';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

type OioFormProps = {
  operationId: string;
  onValuesChange: (values: any) => void;
};

/**
 * 奥集能表单
 */
const OioForm: React.FC<OioFormProps> = ({ operationId }) => {
  useEffect(() => {
    const queryOperationItems = async () => {
      const res = await kernel.queryOperationItems({
        id: operationId,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
    };
    queryOperationItems();
  }, []);
  return <div></div>;
};

export default OioForm;
