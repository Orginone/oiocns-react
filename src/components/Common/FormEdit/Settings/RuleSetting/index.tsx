import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import Icon, { PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import CreateModal from './createModal';
interface listType {
  current: any;
  selectedFiled?: any;
  activeKey: string;
}
const RuleList: React.FC<listType> = ({ current, activeKey, selectedFiled }) => {
  // const { metadata, fields, update } = props.schema;
  const { metadata, fields, update } = current;
  const [cerateVisible, setcreateVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selected, setSelecetd] = useState<any>({});
  // console.log(555, selectedFiled, current);

  // // 布局改变
  // const layoutChange = (value: any) => {
  //   const newFormLayout = { ...formLayout, ...value };
  //   setFormLayout(newFormLayout);
  //   current.metadata.rule = current.metadata.rule || '{}';
  //   current.update({
  //     ...current.metadata,
  //     rule: JSON.stringify({
  //       ...JSON.parse(current.metadata.rule),
  //       ...newFormLayout,
  //     }),
  //   });
  // };


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
          open={true}
          fields={fields}
          targetId={selectedFiled?.id}
          defaultValue={selected}
          setOpen={setcreateVisible}
          // current={props.schema.current}
        />
      )}
    </>
  );
};

export default RuleList;
