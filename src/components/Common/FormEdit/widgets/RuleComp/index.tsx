import React, { useEffect, useState } from 'react';
import { Avatar, List, Tabs } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateModal from './createModal';
interface listType {}
const RuleList: React.FC<listType> = (props: any) => {
  // const { metaData, fields, update } = props.schema;
  const { metaData, fields, update, comp } = props;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selected, setSelecetd] = useState<any>({});
  useEffect(() => {
    if (metaData) {
      const list = JSON?.parse(metaData?.rule ?? '{}')?.list;
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
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `表单配置`,
            key: '1',
            children: <>{comp}</>,
          },

          {
            label: `规则配置`,
            key: '3',
            children: (
              <>
                {RenderHeader}
                {!cerateVisible ? (
                  <List
                    itemLayout="horizontal"
                    // header={RenderHeader}
                    dataSource={dataSource}
                    style={{ width: '100%', padding: '0 10px' }}
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
                    defaultValue={selected}
                    setOpen={setcreateVisible}
                    // current={props.schema.current}
                  />
                )}
              </>
            ),
          },
        ]}
      />
      {/* {RenderHeader}
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
          defaultValue={selected}
          setOpen={setcreateVisible}
          // current={props.schema.current}
        />
      )} */}
    </>
  );
};

export default React.memo(RuleList);
