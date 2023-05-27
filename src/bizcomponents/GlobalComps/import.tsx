import React, { useState } from 'react';
import { message, Upload, UploadProps, Button, Space, Avatar, Progress } from 'antd';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IPropClass } from '@/ts/core';
import { AiOutlineBank, AiOutlineCheck } from 'react-icons/ai';
import { ExcelConfig, readXlsx } from '@/utils/excel';
import { SheetReadConfig } from '@/utils/excel';

interface IProps {
  title: string;
  species: IPropClass;
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  sheetReadConfigs: SheetReadConfig[];
  completed?: () => void;
}

/*
  编辑
*/
const ImportModal = (props: IProps) => {
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
      let config: ExcelConfig = {
        onProgress: function (progress: number): void {
          setProgress(progress);
        },
        onError: function (error: string): void {
          message.error(error);
        },
        onCompleted: function (): void {
          props.completed?.apply(props);
        },
      };
      readXlsx(options.file as File, config, props.sheetReadConfigs);
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
