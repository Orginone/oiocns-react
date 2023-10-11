import React, { useRef } from 'react';
import style from './index.module.less';
import { Segmented, Card, Space, Divider, Typography, Affix } from 'antd';
import useStorage from '@/hooks/useStorage';
import * as fa from '@/icons/fa';

type segmentedTypes = 'icon' | 'table' | 'list';

interface IProps {
  descriptions: string;
  content: React.ReactNode;
  onSegmentChanged: (type: segmentedTypes) => void;
}
/**
 * 存储-文件系统
 */
const SegmentContent: React.FC<IProps> = ({
  content,
  descriptions,
  onSegmentChanged,
}: IProps) => {
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const parentRef = useRef<any>();

  return (
    <Card className={style.pageCard} bordered={false}>
      <div className={style.mainContent} ref={parentRef}>
        {content}
      </div>
      <Affix style={{ position: 'absolute', right: 10, bottom: 0 }}>
        <Segmented
          value={segmented}
          onChange={(value) => {
            setSegmented(value as segmentedTypes);
            onSegmentChanged(value as segmentedTypes);
          }}
          options={[
            {
              value: 'list',
              icon: (
                <fa.FaList
                  fontSize={20}
                  color={segmented === 'list' ? 'blue' : '#9498df'}
                />
              ),
            },
            {
              value: 'icon',
              icon: (
                <fa.FaTh
                  fontSize={20}
                  color={segmented === 'icon' ? 'blue' : '#9498df'}
                />
              ),
            },
            {
              value: 'table',
              icon: (
                <fa.FaTable
                  fontSize={20}
                  color={segmented === 'table' ? 'blue' : '#9498df'}
                />
              ),
            },
          ]}
        />
      </Affix>
      <Affix style={{ position: 'absolute', left: 10, bottom: 0 }}>
        <Space split={<Divider type="vertical" />}>
          <Typography.Link>{descriptions}</Typography.Link>
        </Space>
      </Affix>
    </Card>
  );
};
export default SegmentContent;
