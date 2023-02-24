import React from 'react';
import { XOperation } from '@/ts/base/schema';
import OioForm from '@/pages/Setting/components/render';

// 卡片渲染
interface IProps {
  operations: XOperation[];
}
/**
 * 办事-订单
 * @returns
 */
const Work: React.FC<IProps> = ({ operations }) => {
  return (
    <>
      {operations.length > 0 && (
        <>
          {operations.map((operation) => (
            <OioForm
              key={operation.id}
              operationId={operation.id}
              operationItems={operation.items ?? []}
              designSps={operation.operationRelations ?? []}
              onValuesChange={(values) => console.log('values', values)}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Work;
