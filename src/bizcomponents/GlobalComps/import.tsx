import React, { useState } from 'react';
import { message, Upload, UploadProps, Button, Space, Avatar, Progress } from 'antd';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IPropClass } from '@/ts/core';
import { AiOutlineBank, AiOutlineCheck } from 'react-icons/ai';
import { readXlsx } from '@/utils/excel';

interface Iprops {
  title: string;
  species: IPropClass;
  open: boolean;
  /** 需要读取的 Sheet 名称 */
  sheetNumber: number;
  /** 导入前需要初始化的内容 */
  beforeImport?: () => Promise<void>;
  /** 读取到每一行数据时处理的回调函数 */
  operatingItem: (item: any) => Promise<void>;
  handleCancel: () => void;
  handleOk: () => void;
}
/*
  编辑
*/
const ImportModal = (props: Iprops) => {
  const [progress, setProgress] = useState<number>(0);
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    beforeUpload: (file) => {
      const isXlsx =
        file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXlsx) {
        message.error(`${file.name} 不是一个 xlsx 文件`);
      }
      return isXlsx;
    },
    async customRequest(options) {
      let onProgress = (progress: number | string) => {
        if (typeof progress == 'number') {
          setProgress(progress);
        } else {
          message.error(progress);
        }
      };
      if (props.beforeImport) {
        await props.beforeImport();
      }
      readXlsx(options.file as File, props.sheetNumber, props.operatingItem, onProgress);
    },
  };
  const columns: ProFormColumnsType[] = [
    {
      title: '文件',
      dataIndex: 'file',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <>
            <Space>
              <Avatar
                size={64}
                style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
                src={
                  progress >= 100 ? (
                    <AiOutlineCheck style={{ fontSize: 16 }} />
                  ) : (
                    <AiOutlineBank style={{ fontSize: 16 }} />
                  )
                }
              />
              <Upload {...uploadProps}>
                <Button type="link">上传文件</Button>
              </Upload>
            </Space>
            <Progress
              style={{ marginTop: '10px' }}
              percent={progress}
              width={360}
              type={'line'}
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
          </>
        );
      },
    },
  ];
  return (
    <SchemaForm
      title={props.title}
      open={props.open}
      width={640}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={() => props.handleOk()}
      onOpenChange={(open: boolean) => {
        if (!open) {
          props.handleCancel();
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default ImportModal;
