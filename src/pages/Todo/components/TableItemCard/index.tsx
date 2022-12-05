import { Card, Avatar, Space, Typography, Dropdown, MenuProps } from 'antd';
import React from 'react';
import styles from './index.module.less';
import moment from 'moment';
import { IApplyItem, IApprovalItem } from '@/ts/core/todo/itodo';
const { Meta } = Card;
interface TableItemCardProps<T> {
  data: T[];
  targetOrTeam: 'target' | 'team' | 'market' | 'product';
  // eslint-disable-next-line no-unused-vars
  statusType: (item: T) => React.ReactNode | string;
  // eslint-disable-next-line no-unused-vars
  operation?: (item: T) => MenuProps['items'];
}
/**
 *
 * @param data <T extends ApprovalType> 需要渲染的数据列表
 * @params statusType 事项 卡片tag显示的类型
 * @returns JSX.Element
 */
const TableItemCard = <T extends IApplyItem | IApprovalItem>(
  props: TableItemCardProps<T>,
) => {
  const { data, statusType, targetOrTeam, operation } = props;
  return (
    <>
      {data.map((instans: T) => {
        const item = instans.Data;
        return (
          <Card key={item.id} className={styles[`table-card`]}>
            <Meta
              avatar={
                <Avatar className={styles[`card-icon`]} size="large">
                  {item[targetOrTeam].name.substring(0, 1)}
                </Avatar>
              }
              title={
                <div>
                  <Space>
                    <span className={styles['card-title']}>
                      {item[targetOrTeam].name}
                    </span>
                    {statusType && statusType(instans)}
                  </Space>
                  {operation && (
                    <Dropdown.Button
                      type="text"
                      menu={{ items: operation(instans) }}
                      className={styles['drop-down']}
                    />
                  )}
                </div>
              }
              description={
                <Typography.Text type="secondary" className={styles['card-description']}>
                  申请时间：{moment(item.createTime).format('YYYY/MM/DD HH:mm:ss')}
                </Typography.Text>
              }
            />
          </Card>
        );
      })}
    </>
  );
};
export default TableItemCard;
