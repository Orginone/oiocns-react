import React, { useMemo, useState } from 'react';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
import { XOperation } from '@/ts/base/schema';
import OioForm from '@/pages/Setting/components/render';

// 卡片渲染
interface IProps {
  ids: string[];
}
/**
 * 办事-订单
 * @returns
 */
const Work: React.FC<IProps> = ({ ids }) => {
  const [operations, setOperations] = useState<XOperation[]>([]);
  useMemo(() => {
    if (ids.length > 0) {
      setTimeout(async () => {
        const res = await kernel.queryOperationBySpeciesIds({
          ids: ids,
          spaceId: userCtrl.space.id,
        });
        setOperations(res.data.result ?? []);
      }, 200);
    } else {
      setOperations([]);
    }
  }, ids);

  return (
    <>
      {operations.length > 0 && (
        <div>
          {operations.map((operation) => (
            <OioForm
              key={operation.id}
              operationId={operation.id}
              operationItems={operation.items ?? []}
              designSps={operation.operationRelations ?? []}
              onValuesChange={(values) => console.log('values', values)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Work;
