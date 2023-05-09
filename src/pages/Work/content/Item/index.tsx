import { Badge, Card, List, Tag } from 'antd';
import React from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IWorkDefine } from '@/ts/core/thing/base/work';
import * as im from 'react-icons/im';

interface IProps {
  current: IWorkDefine[];
  filter: string;
}

/**
 * @description: 办事项内容
 * @return {*}
 */

const WorkItem: React.FC<any> = ({ current, filter }: IProps) => {
  current = current.filter(
    (a) => a.metadata.name.includes(filter) || a.metadata.code.includes(filter),
  );
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
                      <TeamIcon share={item.share} size={40} fontSize={40} />
                    </Badge>
                  }
                  title={
                    <div>
                      <span style={{ marginRight: 10 }}>{item.metadata.name}</span>
                      <Tag key={item.metadata.code} color="success">
                        {item.metadata.code}
                      </Tag>
                      <Tag key={item.metadata.belongId} color="success">
                        {orgCtrl.user.findShareById(item.metadata.belongId).name}
                      </Tag>{' '}
                      {item.metadata.belongId != item.metadata.shareId && (
                        <Tag key={item.metadata.shareId} color="success">
                          {orgCtrl.user.findShareById(item.metadata.shareId).name}
                        </Tag>
                      )}
                    </div>
                  }
                  description={item.metadata.remark}
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
