import PageCard from '@/components/PageCard';
import { Card, Descriptions, Space, Tabs } from 'antd';
import React, { useRef } from 'react';
import cls from './index.module.less';
import orgCtrl from '@/ts/controller';
import { IAuthority } from '@/ts/core/target/authority/iauthority';

interface IProps {
  current: IAuthority;
}
/**
 * 权限设定
 * @returns
 */
const AuthorityStandrad: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null); //父级容器Dom

  return (
    <div className={cls[`dept-content-box`]}>
      {current && (
        <>
          {/** 分类特性表单 */}
          <div className={cls['pages-wrap']}>
            <PageCard bordered={false} bodyStyle={{ paddingTop: 16 }}>
              <div className={cls['page-content-table']} ref={parentRef}>
                <Tabs
                  items={[
                    {
                      label: `基本信息`,
                      key: '基本信息',
                      children: (
                        <Card bordered={false} className={cls['company-dept-content']}>
                          <Descriptions
                            size="middle"
                            title={'权限'}
                            extra={[]}
                            bordered
                            column={2}
                            labelStyle={{
                              textAlign: 'left',
                              color: '#606266',
                              width: 120,
                            }}
                            contentStyle={{ textAlign: 'left', color: '#606266' }}>
                            <Descriptions.Item label="权限名称">
                              {current.target.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="共享组织">
                              <Space>
                                <strong>
                                  {orgCtrl.provider.findNameById(current.target.belongId)}
                                </strong>
                              </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="权限编码">
                              {current.target.code || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="创建人">
                              {orgCtrl.provider.findNameById(current.target.belongId)}
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间">
                              {current.target?.createTime || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="备注" span={2}>
                              {current.target?.remark}
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      ),
                    },
                  ]}
                />
              </div>
            </PageCard>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthorityStandrad;
