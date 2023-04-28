import './index.less';

import { Button, Collapse, Descriptions, Space, Tabs, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
// import { SearchOutlined } from '@ant-design/icons';
import { DataType } from '../config/funs';
import PageCtrl from '../pageCtrl';
import type { TabsProps } from 'antd';
import { Sticky, StickyContainer } from 'react-sticky';
import { ProForm } from '@ant-design/pro-components';
import RenderFormItem from '../components/RenderFormItem';
import { CloseCircleOutlined } from '@ant-design/icons';
const { Paragraph } = Typography;
interface OperationType {
  Open: boolean;
}
const { Panel } = Collapse;
const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style = {} }) => (
      <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
    )}
  </Sticky>
);

const Operation: React.FC<OperationType> = ({ Open }) => {
  const [Title, setTitle] = useState<string>(
    (PageCtrl.EditInfo.title as string) ?? '页面名称',
  );
  const [activeTag, setActiveTag] = useState<'1' | '2'>('1'); //组件列表。配置界面
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [comp, setComp] = useState<any>({});
  useEffect(() => {
    PageCtrl.subscribePart('SelectedComp', () => {
      setComp(PageCtrl.SelectedComp);
    });
    PageCtrl.subscribePart('DataSource', () => {
      setDataSource([...PageCtrl.dataSource]);
    });
    return () => {
      PageCtrl.unsubscribe(['SelectedComp', 'DataSource']);
    };
  }, []);
  // 组件列表渲染
  const CompGroup = (
    <Collapse defaultActiveKey={['系统组件']} expandIconPosition={'end'}>
      {dataSource.map((item: DataType, idx: number) => {
        return (
          <Panel header={item.title} key={idx}>
            {item.list.map((comp, index) => (
              <div
                className="comp-con"
                key={comp.i + '&' + index}
                onClick={() => {
                  PageCtrl.AddCompItem(comp);
                }}>
                {comp.name}
              </div>
            ))}
          </Panel>
        );
      })}
    </Collapse>
  );
  // 配置信息展示
  const formGroup: () => any[] = () => {
    let extra = [];
    if (comp.name === '轮播图') {
      extra.push({
        label: '轮播图列表',
        id: 'slideshow',
        type: 'upload',
        limit: 10,
      });
    }
    return [
      {
        label: '背景色',
        id: 'backgroundColor',
        type: 'color',
      },
      {
        label: '背景图地址',
        id: 'backgroundImage',
        type: 'input',
      },
      {
        label: '背景图',
        id: 'backgroundImages',
        type: 'upload',
        limit: 1,
      },
      ...extra,
    ];
  };
  // 配置页渲染
  const SetComp = useMemo(() => {
    if (!comp) {
      return <></>;
    }
    const renderTitle = (
      <>
        {comp.name ? (
          <div className="flex justify-between">
            <span>{comp.name}</span>
            <CloseCircleOutlined
              onClick={() => {
                PageCtrl.setSelectedComp = {} as any;
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        ) : (
          '未选择组件'
        )}
      </>
    );
    return (
      <>
        <Descriptions title={renderTitle} column={1} layout="horizontal"></Descriptions>
        <ProForm
          submitter={false}
          initialValues={{ compTitle: comp.name }}
          onValuesChange={(changeObj) => {
            PageCtrl.UpdateCompItem(changeObj);
          }}>
          {formGroup().map((col: any) => {
            return RenderFormItem({ comp, col });
          })}
        </ProForm>
      </>
    );
  }, [comp]);

  const items = [
    {
      label: `组件`,
      key: '1',
      children: CompGroup,
    },
    {
      label: `配置`,
      key: '2',
      children: SetComp,
    },
  ];

  return (
    <>
      <Space
        className="comp-content"
        direction="vertical"
        size="middle"
        style={{ display: Open ? 'flex' : 'none' }}>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={() => PageCtrl.PageConfirm('clear')}>
          清空面板
        </Button>
        <Paragraph
          style={{ width: '90%', marginLeft: '20px' }}
          strong
          editable={{
            onChange: (txt: string) => {
              setTitle(txt);
              PageCtrl.handleRenamePage(txt);
            },
          }}>
          {Title}
        </Paragraph>

        <StickyContainer>
          <Tabs
            defaultActiveKey={activeTag}
            key={comp.i}
            onChange={(v: string) => setActiveTag(v as '1' | '2')}
            renderTabBar={renderTabBar}
            items={items}
          />
        </StickyContainer>
      </Space>
      <Space
        className={`footer ${Open ? '' : 'notOpenWrap'}`}
        direction="vertical"
        style={{ display: 'flex' }}>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={() => PageCtrl.PageConfirm('save')}>
          保存
        </Button>
        <Button style={{ width: '100%' }} onClick={() => PageCtrl.PageConfirm('back')}>
          返回
        </Button>
      </Space>
    </>
  );
};

export default Operation;