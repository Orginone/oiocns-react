import React from 'react';
import {
  EyeOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Select, Button, message } from 'antd';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import cls from './index.module.less';

type LayoutHeaderProps = {
  OnPreview: Function;
  OnExit: Function;
  [key: string]: any;
  backTable?: () => void;
  titleName: string;
};
/**
 * 标题栏
 * @returns
 */
const LayoutHeader: React.FC<LayoutHeaderProps> = (props: LayoutHeaderProps) => {
  const { titleName } = props;
  const form = useAppwfConfig((state: any) => state.form);
  const scale = useAppwfConfig((state: any) => state.scale);
  const setScale = useAppwfConfig((state: any) => state.setScale);
  // const getFormFields = useAppwfConfig((state: any) => state.getFormFields);
  const changeScale = (val: any) => {
    setScale(val);
  };

  const preview = () => {
    props.OnPreview();
  };

  const publish = () => {
    console.log('搜集上来的表单', DefaultProps.getFormFields());
    message.warning('该功能尚未开放');
  };
  return (
    <div className={cls['all-content']}>
      <div className={cls['layout-title']}>
        {form.formId && (
          <div className={cls['layout-header']}>
            {/* <span className={cls['layout-title-business']}>
              业务名：{form.formName || form.business || form.formId}
            </span> */}
            <span className={cls['layout-titlebinding']}>
              绑定已有流程：
              <Select
                style={{ width: 100 }}
                placeholder="请选择流程"
                allowClear
                options={[]}
              />
            </span>
          </div>
        )}
      </div>
      <div>
        <div className={cls['layout-header']}>
          <div className={cls['back']}>
            <span>流程名：{titleName}</span>
            {/* <Button  size="small" onClick={exit} style={{ width: 100 }}>
        <CloseOutlined />
          退出
        </Button> */}
          </div>
          <div className={cls['publish']}>
            <Button className={cls['publish-preview']} size="small" onClick={preview}>
              <EyeOutlined />
              预览
            </Button>
            <Button
              className={cls['publis-issue']}
              size="small"
              type="primary"
              onClick={publish}>
              <SendOutlined />
              发布
            </Button>
            <Button
              className={cls['scale']}
              size="small"
              disabled={scale <= 40}
              onClick={() => changeScale(scale - 10)}>
              <MinusOutlined />
            </Button>
            <span>{scale}%</span>
            <Button
              size="small"
              disabled={scale >= 150}
              onClick={() => changeScale(scale + 10)}>
              <PlusOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutHeader;
