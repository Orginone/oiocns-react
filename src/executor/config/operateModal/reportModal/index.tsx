import React from 'react';
import { Col, Divider, Layout, Row, Space, Typography } from 'antd';
import cls from './index.module.less';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/executor/tools/fullScreen';
import { RightBarIcon } from '@/components/Common/GlobalComps/customIcon';
import { Resizable } from 'devextreme-react';
import useStorage from '@/hooks/useStorage';
import ReportDesign from '@/components/Common/ReportDesign';
import RuleSetting from '@/components/Common/FormEdit/Settings/RuleSetting/index';
const { Content, Sider } = Layout;

interface IProps {
  current: IForm;
  finished: () => void;
}
const ReportModal: React.FC<IProps> = ({ current, finished }: IProps) => {
  const [rightSider, setRightSider] = useStorage<boolean>('rightSider', false);
  const [mainWidth, setMainWidth] = useStorage<string | number>('mainWidth', '70%');

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={finished}>
      <Layout className={cls.layout}>
        <Row className={cls[`content-top`]}>
          <Col className={cls.rightstyle}>
            <Space wrap split={<Divider type="vertical" />} size={2}>
              <Typography.Link
                title={'切换辅助侧栏'}
                style={{ fontSize: 18 }}
                onClick={() => setRightSider(!rightSider)}>
                <RightBarIcon size={18} width={8} selected={rightSider} />
              </Typography.Link>
            </Space>
          </Col>
        </Row>
        <Layout>
          {rightSider}
          {rightSider ? (
            <>
              <Resizable
                handles={'right'}
                width={mainWidth}
                onResize={(e) => setMainWidth(e.width)}>
                <Sider className={cls.content} width={'100%'}>
                  <ReportDesign current={current} finished={finished}></ReportDesign>
                </Sider>
              </Resizable>
              <Content className={cls.content}>
                <RuleSetting current={current} activeKey={'3'}></RuleSetting>
              </Content>
            </>
          ) : (
            <Content className={cls.content}>
              <ReportDesign current={current} finished={finished}></ReportDesign>
            </Content>
          )}
        </Layout>
      </Layout>
    </FullScreenModal>
  );
};

export default ReportModal;
