import React, { FC, useState } from 'react';
import { Spin, Card, Row, Col, Badge, Space } from 'antd';
import orgCtrl from '@/ts/controller';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { IApplication, IFile } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import cls from '../index.module.less';
interface IProps {
  // file: IFile;
}

const AllApplication: FC<IProps> = (props) => {
  const [applications, setApplications] = useState<IApplication[]>([]);

  const [loaded] = useFlagCmdEmitter('applications', async () => {
    const res = await orgCtrl.loadApplications();
    setApplications(res);
  });
  return (
    <div className={cls['ysyt-applications']}>
      <h4>全部应用</h4>
      <Spin spinning={!loaded} tip={'加载中...'}>
        <Row>
          <Space>
            {applications.map((item) => {
              return (
                <Col style={{ textAlign: 'center' }} flex="center" key={item.key}>
                  <Card>
                    <div style={{ marginLeft: '-10px' }}>
                      <Badge>
                        <EntityIcon entity={item.metadata} size={35} />
                      </Badge>
                    </div>
                    <div>{item.name}</div>
                  </Card>
                </Col>
              );
            })}
          </Space>
        </Row>
      </Spin>
    </div>
  );
};

export default AllApplication;
