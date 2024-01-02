import React, { useRef } from 'react';
import style from './index.module.less';
import { Segmented, Space, Divider, Typography, Affix } from 'antd';
import useStorage from '@/hooks/useStorage';
import * as fa from 'react-icons/fa';
import { Theme } from '@/config/theme';

type segmentedTypes = 'icon' | 'table' | 'list';

interface IProps {
  height?: number | string;
  descriptions: string;
  children?: React.ReactNode; // 子组件
  onSegmentChanged: (type: segmentedTypes) => void;
}
/**
 * 存储-文件系统
 */
const SegmentContent: React.FC<IProps> = ({
  height,
  children,
  descriptions,
  onSegmentChanged,
}: IProps) => {
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const parentRef = useRef<any>();

  return (
    <div style={{ height: height }} className={style.pageCard}>
      <div className={style.mainContent} ref={parentRef}>
        {children && children}
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
                  color={segmented === 'list' ? 'blue' : Theme.FocusColor}
                />
              ),
            },
            {
              value: 'icon',
              icon: (
                <fa.FaTh
                  fontSize={20}
                  color={segmented === 'icon' ? 'blue' : Theme.FocusColor}
                />
              ),
            },
            // {
            //   value: 'table',
            //   icon: (
            //     <fa.FaTable
            //       fontSize={20}
            //       color={segmented === 'table' ? 'blue' : Theme.FocusColor}
            //     />
            //   ),
            // },
          ]}
        />
      </Affix>
      <Affix style={{ position: 'absolute', left: 10, bottom: 0 }}>
        <Space split={<Divider type="vertical" />}>
          <Typography.Link>{descriptions}</Typography.Link>
        </Space>
      </Affix>
    </div>
  );
};
export default SegmentContent;
