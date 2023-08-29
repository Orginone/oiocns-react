import React, { useEffect, useState } from 'react';
import { Avatar, List, Tabs } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateModal from './createModal';
interface listType {
  current: any;
  selectedFiled?: any;
}
const RuleList: React.FC<listType> = ({ current, selectedFiled }) => {
  // const { metadata, fields, update } = props.schema;
  const { metadata, fields, update } = current;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selected, setSelecetd] = useState<any>({});
  console.log(555, selectedFiled);

  useEffect(() => {
    if (metadata) {
      const list = JSON?.parse(metadata?.rule ?? '{}')?.list;
      setDataSource(list ?? []);
    }
  }, []);

  const [cerateVisible, setcreateVisible] = useState<boolean>(false);

  const RenderHeader = (
    <div className="flex justify-between" style={{ padding: '10px' }}>
      <span>规则配置</span>
      <PlusCircleOutlined
        onClick={() => {
          setSelecetd({});
          setcreateVisible(!cerateVisible);
        }}
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
            pageSize: 4,
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
          targetId={selectedFiled.$id?.split('/')?.[1]}
          defaultValue={selected}
          setOpen={setcreateVisible}
          // current={props.schema.current}
        />
      )}
    </>
  );
};

export default RuleList;
