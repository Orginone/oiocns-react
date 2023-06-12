import { Badge, Card, List, Tag } from 'antd';
import React from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import * as im from 'react-icons/im';
import { IWorkDefine } from '@/ts/core';

interface IProps {
  current: IWorkDefine[];
  filter: string;
}

/**
 * @description: 办事项内容
 * @return {*}
 */

const WorkItem: React.FC<any> = ({ current, filter }: IProps) => {
  current = current.filter((a) => a.name.includes(filter) || a.code.includes(filter));
  return (
    <Card>
      {current.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={current}
          renderItem={(item: IWorkDefine) => {
            return (
              <List.Item
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  orgCtrl.currentKey = item.key;
                  orgCtrl.changCallback();
                }}
                actions={[
                  <a
                    key="发起办事"
                    title="发起办事"
                    onClick={async () => {
                      orgCtrl.currentKey = item.key;
                      orgCtrl.changCallback();
                    }}>
                    <im.ImPlus style={{ fontSize: 18 }} />
                  </a>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Badge size="small">
                      <TeamIcon entityId={item.id} typeName={item.typeName} size={40} />
                    </Badge>
                  }
                  title={
                    <div>
                      <span style={{ marginRight: 10 }}>{item.name}</span>
                      <Tag key={item.metadata.code} color="success">
                        {item.metadata.code}
                      </Tag>
                      <Tag key={item.metadata.belongId} color="success">
                        {item.belong.name}
                      </Tag>{' '}
                      {item.metadata.belongId != item.metadata.shareId && (
                        <Tag key={item.metadata.shareId} color="success">
                          {item.share.name}
                        </Tag>
                      )}
                    </div>
                  }
                  description={item.remark}
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};
export default WorkItem;
