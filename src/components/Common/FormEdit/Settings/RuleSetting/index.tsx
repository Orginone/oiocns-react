import React, { useEffect, useState } from 'react';
import { List, message } from 'antd';
import Icon, { PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import CreateModal from './createModal';
interface listType {
  current: any;
  selectedFiled?: any;
  activeKey: string;
}
const RuleList: React.FC<listType> = ({ current, activeKey, selectedFiled }) => {
  // const { metadata, fields, update } = props.schema;
  const { metadata, fields } = current;
  const [cerateVisible, setcreateVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selected, setSelecetd] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (metadata) {
      const list = JSON?.parse(metadata?.rule ?? '{}')?.list;
      setDataSource(list ?? []);
    }
  }, []);

  useEffect(() => {
    /* 处理切换顶部tab时，再次切换回来 进入列表页 */
    if (activeKey !== '3') {
      setcreateVisible(false);
    }
  }, [activeKey]);

  async function handleRuleInfoUpdata(
    type: 'updata' | 'create' | 'delete',
    ruleInfo: Record<string, any>,
  ) {
    setLoading(true);
    const oriRuleInfo = JSON.parse(current.metadata.rule || '{}');
    let RuleList = oriRuleInfo.list ?? [];
    let canContinue = false;

    switch (type) {
      case 'updata':
        RuleList = RuleList.map((item: any) => {
          if (item.code === ruleInfo.code) {
            canContinue = true;
            return ruleInfo;
          }
          return item;
        });
        break;
      case 'create':
        canContinue = true;
        RuleList.push(ruleInfo);
        break;
      case 'delete':
        canContinue = true;
        RuleList = RuleList.filter((item: any) => item.code !== ruleInfo.code);
        break;

      default:
        break;
    }

    if (!canContinue) {
      message.warning('规则编码未匹配，请检查');
      setLoading(false);
      return false;
    } else {
      await current.update({
        ...current.metadata,
        rule: JSON.stringify({
          ...oriRuleInfo,
          list: RuleList,
        }),
      });
      setLoading(false);
      setcreateVisible(false);
      setDataSource(RuleList);
    }
  }
  const RenderHeader = (
    <div className="flex justify-between" style={{ padding: '0 10px' }}>
      <span>规则列表</span>
      <Icon
        onClick={() => {
          setSelecetd({});
          setcreateVisible(!cerateVisible);
        }}
        component={(!cerateVisible ? PlusCircleOutlined : RollbackOutlined) as any}
      />
    </div>
  );
  return (
    <>
      {RenderHeader}
      {!cerateVisible ? (
        <List
          itemLayout="horizontal"
          // header={RenderHeader}
          dataSource={dataSource}
          style={{ width: '100%', padding: '10px' }}
          rowKey={'code'}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 6,
          }}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                setSelecetd(item);
                setcreateVisible(true);
              }}>
              <List.Item.Meta title={item.name} description={item.remark} />
            </List.Item>
          )}
        />
      ) : (
        <CreateModal
          fields={fields}
          targetId={selectedFiled?.id}
          defaultValue={selected}
          loading={loading}
          setOpen={setcreateVisible}
          handleOk={handleRuleInfoUpdata}
          // current={props.schema.current}
        />
      )}
    </>
  );
};

export default RuleList;
