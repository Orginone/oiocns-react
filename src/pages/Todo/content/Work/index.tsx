import React from 'react';
import { XOperation } from '@/ts/base/schema';
import OioForm from '@/pages/Setting/components/render';
import { Card, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import cls from './index.module.less';

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
            <Card key={operation.id} title={operation?.name}>
              <OioForm
                operationId={operation.id}
                operationItems={operation.items ?? []}
                designSps={operation.operationRelations ?? []}
                onValuesChange={(values) => console.log('values', values)}
              />
            </Card>
          ))}
          <Button icon={<SaveOutlined />} type="primary" className={cls['bootom_right']}>
            发起
          </Button>
        </>
      )}
    </>
  );
};

export default Work;
