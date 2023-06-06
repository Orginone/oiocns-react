import React, { useState, useEffect } from 'react';
import { Select, Form } from 'antd';
import { NodeType, FieldCondition, conditiondType } from '../../processType';
import SelectOrg from '@/pages/Setting/content/Standard/Flow/Comp/selectOrg';
import cls from './index.module.less';
import orgCtrl from '@/ts/controller';

interface IProps {
  currnet: NodeType;
  conditions?: FieldCondition[];
}

/**
 * @description: 组织选择
 * @return {*}
 */
const DeptWayGroupItemConfig: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();
  const [currentNode, setCurrentNode] = useState<NodeType>();
  // const [conditions, setConditions] = useState<FieldCondition[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setCurrentNode(props.currnet);
    // setConditions(props.conditions || []);
    form.setFieldsValue({ allContent: props.currnet.conditions });
  }, [props]);

  const onChange = (newValue: string) => {
    currentNode?.conditions.map((item: conditiondType, _index: number) => {
      item.val = newValue;
    });
    setKey(key + 1);
  };

  return (
    <div>
      <Form form={form} onValuesChange={async () => {}}>
        {[...(currentNode?.conditions || [])]?.map((condition, index) => (
          <div key={index + '_g'} className={cls['group']}>
            <div className={cls['group-header']}>
              <span className={cls['group-name']}>组织</span>
              <div className={cls['group-cp']}>
                <Form.Item name={['allContent', index, 'key']}>
                  <Select
                    style={{ width: 100 }}
                    placeholder="判断条件"
                    disabled
                    options={[{ value: 'EQ', label: '=' }]}
                  />
                </Form.Item>

                {/* 组织 */}
                {condition.type == 'BELONG' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <div style={{ width: 200 }}>
                      <SelectOrg key={key} onChange={onChange} orgId={orgCtrl.user.id} />
                    </div>
                  </Form.Item>
                )}
              </div>
              <div className={cls['group-operation']}></div>
            </div>
            <div className={cls['group-content']}></div>
          </div>
        ))}
      </Form>
    </div>
  );
};
export default DeptWayGroupItemConfig;
