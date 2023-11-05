import OpenFileDialog from '@/components/OpenFileDialog';
import FromModal from '@/executor/design/formModal';
import { schema } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { IFile, ITransfer } from '@/ts/core';
import { AnyHandler, AnySheet, Excel, readXlsx } from '@/utils/excel';
import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  InputModal,
  MappingModal,
  RequestModal,
  SelectionModal,
  StoreModal,
  TransferRunning,
} from '../..';

interface IProps {
  current: ITransfer;
}

export const Center: React.FC<IProps> = ({ current }) => {
  const [center, setCenter] = useState(<></>);
  const setEmpty = () => setCenter(<></>);
  useEffect(() => {
    const id = current.command.subscribe(async (type, cmd, args) => {
      switch (type) {
        case 'tools':
          switch (cmd) {
            case 'edit':
              switch (args.typeName) {
                case '请求':
                  setCenter(
                    <RequestModal
                      key={generateUuid()}
                      finished={setEmpty}
                      transfer={current}
                      current={args}
                    />,
                  );
                  break;
                case '映射':
                  setCenter(
                    <MappingModal
                      key={generateUuid()}
                      finished={setEmpty}
                      transfer={current}
                      current={args}
                    />,
                  );
                  break;
                case '存储':
                  setCenter(
                    <StoreModal
                      key={generateUuid()}
                      finished={setEmpty}
                      transfer={current}
                      current={args}
                    />,
                  );
                  break;
                case '子图':
                  {
                    const transfer = current.transfers[args.nextId];
                    if (transfer) {
                      setCenter(
                        <TransferRunning
                          key={generateUuid()}
                          current={transfer}
                          finished={setEmpty}
                        />,
                      );
                    } else {
                      message.error('未绑定配置');
                    }
                  }
                  break;
                case '表单':
                  {
                    const form = current.forms[args.formId];
                    if (form) {
                      setCenter(
                        <FromModal
                          key={generateUuid()}
                          current={form}
                          finished={setEmpty}
                        />,
                      );
                    } else {
                      message.error('未绑定表单');
                    }
                  }
                  break;
              }
              break;
          }
          break;
        case 'data':
          {
            switch (cmd) {
              case 'input':
                setCenter(
                  <InputModal
                    key={generateUuid()}
                    current={args}
                    finished={(value) => {
                      current.command.emitter('data', 'inputCall', value);
                      setEmpty();
                    }}
                  />,
                );
                break;
              case 'selection':
                {
                  const { form, data, selectionNode } = args;
                  setCenter(
                    <SelectionModal
                      key={generateUuid()}
                      form={form}
                      data={data}
                      node={selectionNode}
                      finished={(value) =>
                        current.command.emitter('data', 'selectionCall', {
                          value,
                          selectionNode,
                        })
                      }
                    />,
                  );
                }
                break;
              case 'reading':
                {
                  setCenter(
                    <OpenFileDialog
                      key={generateUuid()}
                      accepts={['Office']}
                      rootKey={current.spaceKey}
                      onOk={async (files: IFile[]) => {
                        setCenter(<></>);
                        try {
                          if (files.length == 0) {
                            throw new Error('请选择一个文件！');
                          }
                          const res = await axios.request({
                            method: 'GET',
                            url: files[0].metadata.id,
                            responseType: 'blob',
                          });
                          const forms = args.formIds.map(
                            (item: string) => current.forms[item],
                          );
                          const sheets = current.template<schema.XThing>(forms);
                          const excel = await readXlsx(
                            res.data as Blob,
                            new Excel(
                              sheets.map((sheet) => {
                                return new AnyHandler(
                                  new AnySheet(
                                    sheet.id,
                                    sheet.name,
                                    sheet.columns,
                                    current.directory,
                                  ),
                                );
                              }),
                            ),
                          );
                          const map: { [key: string]: schema.XThing[] } = {};
                          excel.handlers.forEach(
                            (item) => (map[item.sheet.id] = item.sheet.data),
                          );
                          current.command.emitter('data', 'readingCall', map);
                        } catch (error) {
                          current.command.emitter('data', 'readingCall', error);
                        }
                      }}
                      onCancel={() => {
                        setEmpty();
                        current.command.emitter('data', 'readingCall', new Error('取消'));
                      }}
                    />,
                  );
                }
                break;
              case 'file':
                {
                  setCenter(
                    <OpenFileDialog
                      accepts={args.accepts}
                      rootKey={current.directory.target.directory.key}
                      multiple={args.multiple ?? false}
                      onOk={(files) => {
                        current.command.emitter('data', 'fileCollect', {
                          prop: args.prop,
                          files: files,
                        });
                        setEmpty();
                      }}
                      onCancel={setEmpty}
                    />,
                  );
                }
                break;
            }
          }
          break;
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return <>{center}</>;
};
