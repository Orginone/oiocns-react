import React, { useState } from 'react';
import { message, Upload, UploadProps, Button, Space, Avatar, Progress } from 'antd';
import { ProColumns, ProFormColumnsType, ProTable } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IPropClass } from '@/ts/core';
import { AiOutlineBank, AiOutlineCheck } from 'react-icons/ai';
import { readXlsx } from '@/utils/excel/index';
import { ExcelConfig, SheetConfig, ReadConfig, ErrorMessage } from '@/utils/excel/types';

interface IProps {
  title: string;
  species: IPropClass;
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  readConfigs: (
    excelConfig: ExcelConfig<any>,
  ) => ReadConfig<any, any, SheetConfig<any>, ExcelConfig<any>>[];
  completed?: () => void;
}

const errorHeaders: ProColumns<ErrorMessage>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '表名',
    dataIndex: 'sheetName',
    key: 'sheetName',
  },
  {
    title: '行数',
    dataIndex: 'row',
    key: 'row',
  },
  {
    title: '错误信息',
    dataIndex: 'message',
    key: 'message',
    width: 460,
  },
];

/*
  编辑
*/
const ImportModal = (props: IProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
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
      let config: ExcelConfig<any> = {
        progress: 0,
        context: {},
        initialize: () => {
          setProgress(0);
          setErrors([]);
        },
        onProgress: function (progress: number): void {
          this.progress = progress;
          setProgress(progress);
        },
        addProgress: function (partProgress: number): void {
          this.progress += partProgress;
          setProgress(Number(this.progress.toFixed(2)));
        },
        onReadError: function (errorMessage: ErrorMessage[]): void {
          setErrors(errorMessage);
        },
        onError: function (error: string): void {
          message.error(error);
        },
        onCompleted: function (): void {
          props.completed?.apply(props);
        },
      };
      readXlsx(options.file as File, config, props.readConfigs(config));
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
  if (errors.length > 0) {
    columns.push({
      title: '错误信息',
      dataIndex: 'table',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <ProTable
            dataSource={errors}
            cardProps={{ bodyStyle: { padding: 0 } }}
            scroll={{ y: 300 }}
            options={false}
            search={false}
            columns={errorHeaders}
          />
        );
      },
    });
  }
  return (
    <SchemaForm
      title={props.title}
      open={props.open}
      width={860}
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
      columns={columns}
    />
  );
};

export default ImportModal;
