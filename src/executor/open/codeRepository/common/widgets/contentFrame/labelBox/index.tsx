import { SettingFilled } from '@ant-design/icons';
import React from 'react';

interface IProps {}
const LabelBox: React.FC<IProps> = () => {
  return (
    <div className="merge_file">
      <div className="tags_content_right">
        <p className="tags_content_right_title">
          标签 <SettingFilled />
        </p>
        <p className="tags_content_right_desc">未选择标签</p>
        <div className="gap"></div>
        <p className="tags_content_right_title">
          里程碑 <SettingFilled />
        </p>
        <p className="tags_content_right_desc">未选里程碑</p>
        <div className="gap"></div>
        <p className="tags_content_right_title">
          指派成员 <SettingFilled />
        </p>
        <p className="tags_content_right_desc">未指派成员</p>
      </div>
    </div>
  );
};
export { LabelBox };
