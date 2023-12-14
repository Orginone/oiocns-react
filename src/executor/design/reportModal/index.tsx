import React from 'react';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';
import ReportDesign from '@/components/Common/ReportDesign';
interface IProps {
  current: IForm;
  finished: () => void;
}
const ReportModal: React.FC<IProps> = ({ current, finished }: IProps) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      hideMaxed
      width={'80vw'}
      destroyOnClose
      onSave={async () => {
        await current.save();
        finished();
      }}
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={finished}>
      <ReportDesign current={current}></ReportDesign>
      {/* <Layout className={cls.layout}>
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
      </Layout> */}
    </FullScreenModal>
  );
};

export default ReportModal;
