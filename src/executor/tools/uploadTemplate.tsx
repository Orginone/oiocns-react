import { command, model } from '@/ts/base';
import { IDirectory } from '@/ts/core';
import { formatDate } from '@/utils';
import * as el from '@/utils/excel';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal, Spin, Tabs, Upload, message } from 'antd';
import React, { useState } from 'react';

/** 上传导入模板 */
export const uploadTemplate = (dir: IDirectory) => {
  // 默认在根目录导入
  dir = dir.target.directory;
  const show = (excel: el.IExcel, name: string) => {
    showData(
      excel,
      (modal) => {
        modal.destroy();
        generate(dir, name, excel);
      },
      '开始导入',
    );
  };
  function Content() {
    const [loading, setLoading] = useState(false);
    return (
      <>
        <div style={{ marginTop: 20 }}>
          <Button
            onClick={async () => {
              el.generateXlsx(new el.Excel(el.getSheets(dir)), '导入模板');
            }}>
            导入模板下载
          </Button>
          {loading && <span style={{ marginLeft: 20 }}>正在加载数据中，请稍后...</span>}
        </div>
        <Spin spinning={loading}>
          <Upload
            type={'drag'}
            showUploadList={false}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            style={{ width: 550, height: 300, marginTop: 20 }}
            customRequest={async (options) => {
              const file = options.file as Blob;
              setLoading(true);
              let excel = await el.readXlsx(file, new el.Excel(el.getSheets(dir)));
              setLoading(false);
              modal.destroy();
              show(excel, file.name);
            }}>
            <div style={{ color: 'limegreen', fontSize: 22 }}>点击或拖拽至此处上传</div>
          </Upload>
        </Spin>
      </>
    );
  }
  const modal = Modal.info({
    icon: <></>,
    okText: '关闭',
    width: 610,
    title: '导入模板',
    maskClosable: true,
    content: <Content />,
  });
};

/** 展示数据 */
const showData = (excel: el.IExcel, confirm: (modal: any) => void, okText: string) => {
  const modal = Modal.info({
    icon: <></>,
    okText: okText,
    onOk: () => confirm(modal),
    width: 1344,
    title: '数据',
    maskClosable: true,
    content: (
      <Tabs
        items={excel.handlers.map((item) => {
          return {
            label: item.sheet.name,
            key: item.sheet.name,
            children: (
              <ProTable
                key={item.sheet.name}
                dataSource={item.sheet.data}
                cardProps={{ bodyStyle: { padding: 0 } }}
                scroll={{ y: 400 }}
                options={false}
                search={false}
                columns={[
                  {
                    title: '序号',
                    valueType: 'index',
                    width: 50,
                  },
                  ...item.sheet.columns,
                ]}
              />
            ),
          };
        })}
      />
    ),
  });
};

/** 开始导入 */
const generate = async (dir: IDirectory, name: string, excel: el.IExcel) => {
  let errors = excel.handlers.flatMap((item) => item.checkData(excel));
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }
  command.emitter('executor', 'taskList', dir);
  const task: model.TaskModel = {
    name: name,
    size: 0,
    finished: 0,
    createTime: new Date(),
  };
  dir.taskList.push(task);
  const counting = (dir: IDirectory) => {
    let count = 1;
    for (let child of dir.children) {
      count += counting(child);
    }
    return count;
  };
  excel.dataHandler = {
    initialize: (totalRows) => {
      task.size = totalRows;
      task.size += counting(dir) * 50;
      dir.taskEmitter.changCallback();
    },
    onItemCompleted: (count?: number) => {
      task.finished += count ?? 1;
      dir.taskEmitter.changCallback();
    },
    onCompleted: () => {
      task.finished = task.size;
      dir.taskEmitter.changCallback();
      message.success(`模板导入成功！`);
      showData(
        excel,
        (modal) => {
          modal.destroy();
          let fileName = `数据导入模板(${formatDate(new Date(), 'yyyy-MM-dd HH:mm')})`;
          el.generateXlsx(excel, fileName);
        },
        '生成数据模板',
      );
      const dirSheet = excel.handlers.find((item) => item.sheet.name == '目录');
      if (dirSheet) {
        dir.notify('reload', { ...dir.metadata, directoryId: dir.id });
      }
    },
    onReadError: (errors) => {
      showErrors(errors);
    },
  };
  excel.handling();
};

/** 错误数据 */
const showErrors = (errors: el.Error[]) => {
  Modal.info({
    icon: <></>,
    okText: '关闭',
    width: 1000,
    title: '错误信息',
    maskClosable: true,
    content: (
      <ProTable
        dataSource={errors}
        cardProps={{ bodyStyle: { padding: 0 } }}
        scroll={{ y: 500 }}
        options={false}
        search={false}
        columns={[
          {
            title: '序号',
            valueType: 'index',
            width: 50,
          },
          {
            title: '表名',
            dataIndex: 'name',
          },
          {
            title: '行数',
            dataIndex: 'row',
            render: (_: any, data: el.Error) => {
              if (typeof data.row == 'number') {
                return <>{data.row}</>;
              }
              return <>{data.row.join(',')}</>;
            },
          },
          {
            title: '错误信息',
            dataIndex: 'message',
            width: 460,
          },
        ]}
      />
    ),
  });
};
