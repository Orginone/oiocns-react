import { Descriptions, message, Modal } from 'antd';
import { Input } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { IDict, ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import * as im from 'react-icons/im';
import SearchSpecies from '@/pages/Setting/content/Standard/Matcher/SearchSpecies';
import { XAttribute, XDictItem, XTarget, XTargetArray } from '@/ts/base/schema';
import BaseTarget from '@/ts/core/target/base';
import { getUuid } from '@/utils/tools';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { kernel } from '@/ts/base';
import { ResultType } from '@/ts/base/model';

type DataSourceType = {
  id: React.Key;
  sourceAttrId?: string;
  sourceAttr?: string;
  sourceAttrType?: string;
  sourceAttrCode?: string;
  sourceAttrDictId?: string;
  targetAttrId?: string;
  targetAttr?: string;
  targetAttrType?: string;
  targetAttrCode?: string;
  targetAttrDictId?: string;
  matchedDict?: boolean;
  dictMatcher?: any[];
  type?: string;
};

type DictDataSourceType = {
  id: React.Key;
  sourceDictId?: string;
  sourceDictName?: string;
  sourceDict?: IDict;
  sourceDictItemId?: string;
  sourceDictItem?: string;
  sourceDictItemValue?: string;
  targetDictId?: string;
  targetDictName?: string;
  targetDict?: IDict;
  targetDictItemId?: string;
  targetDictItem?: string;
  targetDictItemValue?: string;
  type?: string;
};

/**
 * @description: 分类匹配器
 * @return {*}
 */
const Matcher = (props: any, ref: any) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [editableDictKeys, setEditableDictRowKeys] = useState<React.Key[]>(() => []);
  // const formRef = useRef<ProFormInstance<any>>();
  // const actionRef = useRef<ActionType>();
  // const editableFormRef = useRef<EditableFormInstance>();
  const [showModal, setShowModal] = useState<string>('');
  const [sourceCompany, setSourceCompany] = useState<ITarget>();
  const [targetCompany, setTargetCompany] = useState<ITarget>();
  const [sourceSpecies, setSourceSpecies] = useState<ISpeciesItem>();
  const [targetSpecies, setTargetSpecies] = useState<ISpeciesItem>();
  const [matchAttrs, setMatchAttrs] = useState<readonly DataSourceType[]>([]);
  // const [matchDicts, setMatchDicts] = useState<readonly DictDataSourceType[]>([]);
  const [sourceAttrs, setSourceAttrs] = useState<XAttribute[]>([]);
  const [targetAttrs, setTargetAttrs] = useState<XAttribute[]>([]);
  const [sourceDicts, setSourceDicts] = useState<IDict[]>([]);
  const [targetDicts, setTargetDicts] = useState<IDict[]>([]);
  const [showMatchDictModal, setShowMatchDictModal] = useState<any>();

  const loadData = async () => {
    if (props && props.data) {
      let companysResult: ResultType<XTargetArray> = await kernel.queryTargetById({
        ids: [props.data.sourceCompanyId, props.data.targetCompanyId],
      });
      if (companysResult.success && companysResult.data.result) {
        let companys: XTarget[] = companysResult.data.result;
        let sourceCompany = companys.find(
          (item) => item.id == props.data.sourceCompanyId,
        );
        setSourceCompany(new BaseTarget(sourceCompany as XTarget));
        let targetCompany = companys.find(
          (item) => item.id == props.data.targetCompanyId,
        );
        setTargetCompany(new BaseTarget(targetCompany as XTarget));
      }
      // let speciesResult: ResultType<XSpeciesArray> = await kernel.querySpeciesById({
      //   ids: [props.data.sourceSpeciesId, props.data.targetSpeciesId],
      // });
      // if (speciesResult.success && speciesResult.data.result) {
      //   let speciess: XSpecies[] = speciesResult.data.result;
      //   let sourceSpecies = speciess.find((item) => item.id == props.data.sourceSpeciesId);
      //   setSourceSpecies(new SpeciesItem(sourceSpecies as XSpecies, undefined));
      //   let targetSpecies = speciess.find((item) => item.id == props.data.targetSpeciesId);
      //   setTargetSpecies(new SpeciesItem(targetSpecies as XSpecies, undefined));
      // }
      setMatchAttrs(props.data.matchAttrs);
    }
  };

  useEffect(() => {
    loadData();
  }, props);

  function submit() {
    let data = {
      sourceCompanyId: sourceCompany?.id,
      targetCompanyId: targetCompany?.id,
      sourceSpeciesId: sourceSpecies?.id,
      targetSpeciesId: targetSpecies?.id,
      matchAttrs,
    };
    console.log('data', data);
    console.log('data', JSON.stringify(data));
    message.success('submit');
  }

  function checkValid() {
    if (
      !sourceCompany ||
      !targetCompany ||
      !sourceSpecies ||
      !targetSpecies ||
      !matchAttrs
    ) {
      message.warn('请完成字段匹配');
      return false;
    }
    for (let item of matchAttrs) {
      if (
        item.sourceAttrType == '选择型' &&
        item.targetAttrType == '选择型' &&
        !item.matchedDict
      ) {
        message.warn('请完成字典匹配');
        return false;
      }
    }
    return true;
  }

  useImperativeHandle(ref, () => ({
    submit: submit,
    checkValid: checkValid,
  }));
  //先根据源分类和目标分类查询是否有数据 若有则直接加载，若没有则开始匹配
  const loadOrMatchSpeciesAttrs = async () => {
    if (sourceSpecies && targetSpecies) {
      let exist = false;
      //先load已匹配的数据
      if (exist) {
        console.log('exist');
      } else {
        //查询源和目标的特性
        let sourceAttrs: XAttribute[] =
          (
            await sourceSpecies.loadAttrs(sourceCompany?.id || '', true, true, {
              offset: 0,
              limit: 1000,
              filter: '',
            })
          )?.result || [];
        setSourceAttrs(sourceAttrs);
        let targetAttrs: XAttribute[] =
          (
            await targetSpecies.loadAttrs(targetCompany?.id || '', true, true, {
              offset: 0,
              limit: 1000,
              filter: '',
            })
          ).result || [];
        setTargetAttrs(targetAttrs);
        //查询源和目标的字典
        let dictIds = [...sourceAttrs, ...targetAttrs]
          .filter((item) => item.valueType == '选择型')
          .map((item) => item.dictId);

        let sourceDicts: IDict[] =
          (await sourceSpecies.loadDictsEntity(sourceCompany?.id || '', true, true, {
            offset: 0,
            limit: 1000,
            filter: '',
          })) || [];
        let targetDicts: IDict[] =
          (await targetSpecies.loadDictsEntity(targetCompany?.id || '', true, true, {
            offset: 0,
            limit: 1000,
            filter: '',
          })) || [];

        let usedSourceDicts = sourceDicts.filter((item: IDict) =>
          dictIds.includes(item.id),
        );
        for (let dict of usedSourceDicts) {
          let dictItems: XDictItem[] =
            (
              await dict.loadItems(sourceCompany?.id || '', {
                offset: 0,
                limit: 1000,
                filter: '',
              })
            ).result || [];
          dict.items = dictItems;
        }
        setSourceDicts(usedSourceDicts);
        let usedTargetDicts = targetDicts.filter((item: IDict) =>
          dictIds.includes(item.id),
        );
        for (let dict of usedTargetDicts) {
          let dictItems: XDictItem[] =
            (
              await dict.loadItems(targetCompany?.id || '', {
                offset: 0,
                limit: 1000,
                filter: '',
              })
            ).result || [];
          dict.items = dictItems;
        }
        setTargetDicts(usedTargetDicts);
        //匹配特性并设置数据
        let mergeAttrs = JSON.parse(JSON.stringify(sourceAttrs));
        for (let sourceAttr of mergeAttrs) {
          for (let targetAttr of targetAttrs) {
            if (
              sourceAttr.name == targetAttr.name ||
              sourceAttr.code == targetAttr.code
            ) {
              sourceAttr.target_name = sourceAttr.name;
              sourceAttr.target_id = targetAttr.id;
              sourceAttr.target_valueType = targetAttr.valueType;
              sourceAttr.target_code = targetAttr.code;
              sourceAttr.target_dictId = targetAttr.dictId;
            }
          }
        }
        let matchAttrs_ =
          mergeAttrs.map((attr: any) => {
            return {
              id: getUuid(),
              sourceAttr: attr.name,
              sourceAttrId: attr.id,
              sourceAttrType: attr.valueType,
              sourceAttrCode: attr.code,
              sourceAttrDictId: attr.dictId,
              targetAttr: attr.target_name,
              targetAttrId: attr.target_id,
              targetAttrType: attr.target_valueType,
              targetAttrCode: attr.target_code,
              targetAttrDictId: attr.target_dictId,
            };
          }) || [];

        //匹配字典并设置数据
        let matchDicts: any[] = [];
        matchAttrs_ = matchAttrs_.map((item: any) => {
          if (item.sourceAttrType == '选择型' && item.targetAttrType == '选择型') {
            let matchSingleDict: any[] = [];
            let sourceDict = sourceDicts.find((dict) => dict.id == item.sourceAttrDictId);
            let sourceDictItems = sourceDict?.items || [];
            let targetDict = targetDicts.find((dict) => dict.id == item.targetAttrDictId);
            let targetDictItems = targetDict?.items || [];
            for (let sourceDictItem of sourceDictItems) {
              let matchDictRecord = {
                id: getUuid(),
                sourceDictId: sourceDict?.id,
                sourceDictName: sourceDict?.name,
                sourceDict,
                sourceDictItemId: sourceDictItem.id,
                sourceDictItem: sourceDictItem.name,
                sourceDictItemValue: sourceDictItem.value,
                targetDictId: targetDict?.id,
                targetDictName: targetDict?.name,
                targetDict,
                targetDictItemId: '',
                targetDictItem: '',
                targetDictItemValue: '',
              };
              for (let targetDictItem of targetDictItems) {
                if (sourceDictItem.name == targetDictItem.name) {
                  matchDictRecord.targetDictItemId = targetDictItem.id;
                  matchDictRecord.targetDictItem = targetDictItem.name;
                  matchDictRecord.targetDictItemValue = targetDictItem.value;
                }
              }
              matchSingleDict.push(matchDictRecord);
            }
            matchDicts = [...matchDicts, ...matchSingleDict];
            item.dictMatcher = matchSingleDict.length > 0 ? matchSingleDict : undefined;
          }
          return item;
        });
        setMatchAttrs(matchAttrs_);
        // setMatchDicts(matchDicts);
      }
    } else if (sourceSpecies) {
      let res = await sourceSpecies.loadAttrs(sourceCompany?.id || '', true, true, {
        offset: 0,
        limit: 1000,
        filter: '',
      });
      setSourceAttrs(res.result || []);
      setMatchAttrs(
        res.result?.map((attr: XAttribute) => {
          return {
            id: getUuid(),
            sourceAttr: attr.name,
            sourceAttrCode: attr.code,
            sourceAttrId: attr.id,
            sourceAttrType: attr.valueType,
            sourceAttrDictId: attr.dictId,
            targetAttr: '',
            targetAttrCode: '',
            targetAttrId: '',
            targetAttrType: '',
            targetAttrDictId: '',
          };
        }) || [],
      );
    } else if (targetSpecies) {
      let res = await targetSpecies.loadAttrs(targetCompany?.id || '', true, true, {
        offset: 0,
        limit: 1000,
        filter: '',
      });
      setTargetAttrs(res.result || []);
      setMatchAttrs(
        res.result?.map((attr: XAttribute) => {
          return {
            id: getUuid(),
            sourceAttr: '',
            sourceAttrId: '',
            sourceAttrCode: '',
            sourceAttrType: '',
            sourceAttrDictId: '',
            targetAttr: attr.name,
            targetAttrId: attr.id,
            targetAttrCode: attr.code,
            targetAttrType: attr.valueType,
            targetAttrDictId: attr.dictId,
          };
        }) || [],
      );
    }
  };

  useEffect(() => {
    loadOrMatchSpeciesAttrs();
  }, [sourceSpecies, targetSpecies]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '源特性名称',
      dataIndex: 'sourceAttr',
      valueType: 'select',
      request: async () => {
        return sourceAttrs.map((attr: XAttribute) => {
          return { label: attr.name, value: attr.name };
        });
      },
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: (e: any) => {
            // 每次选中重置参数
            for (let sourceAttr of sourceAttrs) {
              if (sourceAttr.name == e) {
                let matchAttrs_ = JSON.parse(JSON.stringify(matchAttrs));
                matchAttrs_[rowIndex]['sourceAttrId'] = e;
                matchAttrs_[rowIndex]['sourceAttrType'] = sourceAttr.valueType;
                matchAttrs_[rowIndex]['sourceAttrCode'] = sourceAttr.code;
                matchAttrs_[rowIndex]['sourceAttrDictId'] = sourceAttr.dictId;
                for (let i = 0; i < matchAttrs_.length; i++) {
                  if (i != rowIndex && matchAttrs_[i]['sourceAttrId'] == e) {
                    matchAttrs_[i]['sourceAttrId'] = null;
                    matchAttrs_[i]['sourceAttrType'] = null;
                    matchAttrs_[i]['sourceAttrCode'] = null;
                    matchAttrs_[i]['sourceAttr'] = null;
                    matchAttrs_[i]['sourceAttrDictId'] = null;
                  }
                }
                //匹配字典并设置数据
                let matchDicts: any[] = [];
                matchAttrs_ = matchAttrs_.map((item: any) => {
                  if (
                    item.sourceAttrType == '选择型' &&
                    item.targetAttrType == '选择型'
                  ) {
                    let matchSingleDict: any[] = [];
                    let sourceDict = sourceDicts.find(
                      (dict) => dict.id == item.sourceAttrDictId,
                    );
                    let sourceDictItems = sourceDict?.items || [];
                    let targetDict = targetDicts.find(
                      (dict) => dict.id == item.targetAttrDictId,
                    );
                    let targetDictItems = targetDict?.items || [];
                    for (let sourceDictItem of sourceDictItems) {
                      let matchDictRecord = {
                        id: getUuid(),
                        sourceDictId: sourceDict?.id,
                        sourceDictName: sourceDict?.name,
                        sourceDict,
                        sourceDictItemId: sourceDictItem.id,
                        sourceDictItem: sourceDictItem.name,
                        sourceDictItemValue: sourceDictItem.value,
                        targetDictId: targetDict?.id,
                        targetDictName: targetDict?.name,
                        targetDict,
                        targetDictItemId: '',
                        targetDictItem: '',
                        targetDictItemValue: '',
                      };
                      for (let targetDictItem of targetDictItems) {
                        if (sourceDictItem.name == targetDictItem.name) {
                          matchDictRecord.targetDictItemId = targetDictItem.id;
                          matchDictRecord.targetDictItem = targetDictItem.name;
                          matchDictRecord.targetDictItemValue = targetDictItem.value;
                        }
                      }
                      matchSingleDict.push(matchDictRecord);
                    }
                    matchDicts = [...matchDicts, ...matchSingleDict];
                    item.dictMatcher =
                      matchSingleDict.length > 0 ? matchSingleDict : undefined;
                  }
                  return item;
                });
                setMatchAttrs(matchAttrs_);
                // setMatchDicts(matchDicts);
                break;
              }
            }
          },
        };
      },
    },
    {
      title: '源特性代码',
      dataIndex: 'sourceAttrCode',
      valueType: 'text',
      readonly: true,
    },
    {
      title: '源特性类型',
      dataIndex: 'sourceAttrType',
      valueType: 'text',
      readonly: true,
    },
    {
      title: '目标特性名称',
      dataIndex: 'targetAttr',
      valueType: 'select',
      request: async () => {
        return targetAttrs.map((attr: XAttribute) => {
          return { label: attr.name, value: attr.name };
        });
      },
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: (e: any) => {
            // 每次选中重置参数
            for (let targetAttr of targetAttrs) {
              if (targetAttr.name == e) {
                let matchAttrs_ = JSON.parse(JSON.stringify(matchAttrs));
                matchAttrs_[rowIndex]['targetAttrId'] = e;
                matchAttrs_[rowIndex]['targetAttrType'] = targetAttr.valueType;
                matchAttrs_[rowIndex]['targetAttrCode'] = targetAttr.code;
                matchAttrs_[rowIndex]['targetAttrDictId'] = targetAttr.dictId;
                for (let i = 0; i < matchAttrs_.length; i++) {
                  if (i != rowIndex && matchAttrs_[i]['targetAttrId'] == e) {
                    matchAttrs_[i]['targetAttrId'] = null;
                    matchAttrs_[i]['targetAttrType'] = null;
                    matchAttrs_[i]['targetAttrCode'] = null;
                    matchAttrs_[i]['targetAttr'] = null;
                    matchAttrs_[i]['targetAttrDictId'] = null;
                  }
                }
                //匹配字典并设置数据
                let matchDicts: any[] = [];
                matchAttrs_ = matchAttrs_.map((item: any) => {
                  if (
                    item.sourceAttrType == '选择型' &&
                    item.targetAttrType == '选择型'
                  ) {
                    let matchSingleDict: any[] = [];
                    let sourceDict = sourceDicts.find(
                      (dict) => dict.id == item.sourceAttrDictId,
                    );
                    let sourceDictItems = sourceDict?.items || [];
                    let targetDict = targetDicts.find(
                      (dict) => dict.id == item.targetAttrDictId,
                    );
                    let targetDictItems = targetDict?.items || [];
                    for (let sourceDictItem of sourceDictItems) {
                      let matchDictRecord = {
                        id: getUuid(),
                        sourceDictId: sourceDict?.id,
                        sourceDictName: sourceDict?.name,
                        sourceDict,
                        sourceDictItemId: sourceDictItem.id,
                        sourceDictItem: sourceDictItem.name,
                        sourceDictItemValue: sourceDictItem.value,
                        targetDictId: targetDict?.id,
                        targetDictName: targetDict?.name,
                        targetDict,
                        targetDictItemId: '',
                        targetDictItem: '',
                        targetDictItemValue: '',
                      };
                      for (let targetDictItem of targetDictItems) {
                        if (sourceDictItem.name == targetDictItem.name) {
                          matchDictRecord.targetDictItemId = targetDictItem.id;
                          matchDictRecord.targetDictItem = targetDictItem.name;
                          matchDictRecord.targetDictItemValue = targetDictItem.value;
                        }
                      }
                      matchSingleDict.push(matchDictRecord);
                    }
                    matchDicts = [...matchDicts, ...matchSingleDict];
                    item.dictMatcher =
                      matchSingleDict.length > 0 ? matchSingleDict : undefined;
                  }
                  return item;
                });
                setMatchAttrs(matchAttrs_);
                // setMatchDicts(matchDicts);
                break;
              }
            }
          },
        };
      },
    },
    {
      title: '目标特性代码',
      dataIndex: 'targetAttrCode',
      valueType: 'text',
      readonly: true,
    },
    {
      title: '目标特性类型',
      dataIndex: 'targetAttrType',
      valueType: 'text',
      readonly: true,
    },
    {
      title: '匹配字典状态',
      dataIndex: 'matchedDict',
      readonly: true,
      render: (_, row) => (row?.matchedDict ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => {
        let array = [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}>
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              setMatchAttrs(matchAttrs.filter((item) => item.id !== record.id));
            }}>
            删除
          </a>,
        ];
        if (record.sourceAttrType == '选择型' && record.targetAttrType == '选择型') {
          array.push(
            <a
              key="matchDict"
              onClick={() => {
                setShowMatchDictModal({ id: record.id, matchers: record.dictMatcher });
              }}>
              匹配字典
            </a>,
          );
        }
        return array;
      },
    },
  ];

  const getDictColumns = (matcherRecord: any): ProColumns<DictDataSourceType>[] => {
    return [
      {
        title: '源字典名称',
        dataIndex: 'sourceDictName',
        valueType: 'text',
        readonly: true,
      },
      {
        title: '源字典项名称',
        dataIndex: 'sourceDictItem',
        valueType: 'select',
        request: async () => {
          return (
            matcherRecord?.sourceDict.items?.map((item: any) => {
              return { label: item.name, value: item.name };
            }) || []
          );
        },
        fieldProps: (_, { rowIndex }) => {
          return {
            onSelect: (e: any) => {
              // 每次选中重置参数
              if (showMatchDictModal && showMatchDictModal.matchers) {
                let showMatchDictModal_ = JSON.parse(JSON.stringify(showMatchDictModal));
                let dictItems = matcherRecord?.sourceDict.items;
                for (let item of dictItems) {
                  if (item.name == e) {
                    showMatchDictModal_.matchers[rowIndex]['sourceDictItemId'] = e;
                    showMatchDictModal_.matchers[rowIndex]['sourceDictItem'] = item.name;
                    showMatchDictModal_.matchers[rowIndex]['sourceDictItemValue'] =
                      item.value;
                  }
                  for (let i = 0; i < showMatchDictModal_.matchers.length; i++) {
                    if (
                      i != rowIndex &&
                      showMatchDictModal_.matchers[i]['sourceDictItemId'] == e
                    ) {
                      showMatchDictModal_.matchers[i]['sourceDictItemId'] = null;
                      showMatchDictModal_.matchers[i]['sourceDictItem'] = null;
                      showMatchDictModal_.matchers[i]['sourceDictItemValue'] = null;
                    }
                  }
                }
                setShowMatchDictModal(showMatchDictModal_);
              }
            },
          };
        },
      },
      {
        title: '源值',
        dataIndex: 'sourceDictItemValue',
        valueType: 'text',
        readonly: true,
      },
      {
        title: '目标字典名称',
        dataIndex: 'targetDictName',
        valueType: 'text',
        readonly: true,
      },

      {
        title: '目标字典项名称',
        dataIndex: 'targetDictItem',
        valueType: 'select',
        request: async () => {
          return (
            matcherRecord?.targetDict.items?.map((item: any) => {
              return { label: item.name, value: item.name };
            }) || []
          );
        },
        fieldProps: (_, { rowIndex }) => {
          return {
            onSelect: (e: any) => {
              // 每次选中重置参数
              if (showMatchDictModal && showMatchDictModal.matchers) {
                let showMatchDictModal_ = JSON.parse(JSON.stringify(showMatchDictModal));
                let dictItems = matcherRecord?.targetDict.items || [];
                for (let item of dictItems) {
                  if (item.name == e) {
                    showMatchDictModal_.matchers[rowIndex]['targetDictItemId'] = e;
                    showMatchDictModal_.matchers[rowIndex]['targetDictItem'] = item.name;
                    showMatchDictModal_.matchers[rowIndex]['targetDictItemValue'] =
                      item.value;
                  }
                  for (let i = 0; i < showMatchDictModal_.matchers.length; i++) {
                    if (
                      i != rowIndex &&
                      showMatchDictModal_.matchers[i]['targetDictItemId'] == e
                    ) {
                      showMatchDictModal_.matchers[i]['targetDictItemId'] = null;
                      showMatchDictModal_.matchers[i]['targetDictItem'] = null;
                      showMatchDictModal_.matchers[i]['targetDictItemValue'] = null;
                    }
                  }
                }
                setShowMatchDictModal(showMatchDictModal_);
              }
            },
          };
        },
      },
      {
        title: '目标值',
        dataIndex: 'targetDictItemValue',
        valueType: 'text',
        readonly: true,
      },
      {
        title: '操作',
        valueType: 'option',
        render: (text, record, _, action) => [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}>
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              let showMatchDictModal_ = JSON.parse(JSON.stringify(showMatchDictModal));
              showMatchDictModal_.matchers = showMatchDictModal_.matchers.filter(
                (item: any) => item.id !== record.id,
              );
              setShowMatchDictModal(showMatchDictModal_);
            }}>
            删除
          </a>,
        ],
      },
    ];
  };
  return (
    <>
      <Descriptions
        size="middle"
        bordered
        column={2}
        labelStyle={{ textAlign: 'center', color: '#606266' }}
        contentStyle={{ textAlign: 'center', color: '#606266' }}>
        <Descriptions.Item label="源组织">
          <Input
            readOnly={true}
            addonAfter={
              <im.ImSearch
                type="setting"
                onClick={() => {
                  setShowModal('sourceCompany');
                }}
              />
            }
            value={sourceCompany?.name}
            placeholder="请选择组织"
          />
        </Descriptions.Item>
        <Descriptions.Item label="目标组织">
          {' '}
          <Input
            readOnly={true}
            addonAfter={
              <im.ImSearch
                type="setting"
                onClick={() => {
                  setShowModal('targetCompany');
                }}
              />
            }
            value={targetCompany?.name}
            placeholder="请选择组织"
          />
        </Descriptions.Item>
        <Descriptions.Item label="源分类">
          {' '}
          <Input
            readOnly={true}
            addonAfter={
              <im.ImSearch
                type="setting"
                onClick={() => {
                  setShowModal('sourceSpecies');
                }}
              />
            }
            value={sourceSpecies?.name}
            placeholder="请选择分类"
          />
        </Descriptions.Item>
        <Descriptions.Item label="目标分类">
          {' '}
          <Input
            readOnly={true}
            addonAfter={
              <im.ImSearch
                type="setting"
                onClick={() => {
                  setShowModal('targetSpecies');
                }}
              />
            }
            value={targetSpecies?.name}
            placeholder="请选择分类"
          />
        </Descriptions.Item>
      </Descriptions>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="特性匹配"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={false}
        loading={false}
        columns={columns}
        value={matchAttrs}
        onChange={setMatchAttrs}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
        }}
      />
      <Modal
        key={showMatchDictModal}
        title="字典匹配"
        width={'70%'}
        destroyOnClose={true}
        open={showMatchDictModal != undefined}
        bodyStyle={{ padding: 0 }}
        okText="确定"
        onOk={async () => {
          let matchAttrs_ = JSON.parse(JSON.stringify(matchAttrs));
          matchAttrs_.map((item: any) => {
            if (showMatchDictModal.id == item.id && !item.matchedDict) {
              item.dictMatcher = showMatchDictModal.matchers;
              item.matchedDict = true;
            }
            return item;
          });
          setMatchAttrs(matchAttrs_);
          setShowMatchDictModal(undefined);
        }}
        onCancel={() => {
          setShowMatchDictModal(undefined);
        }}>
        <EditableProTable<DictDataSourceType>
          rowKey="id"
          scroll={{
            x: 960,
          }}
          recordCreatorProps={false}
          loading={false}
          columns={getDictColumns(
            showMatchDictModal ? showMatchDictModal.matchers[0] : undefined,
          )}
          value={showMatchDictModal?.matchers || []}
          editable={{
            type: 'multiple',
            editableKeys: editableDictKeys,
            onChange: setEditableDictRowKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
            },
          }}
        />
      </Modal>

      <Modal
        title={showModal.includes('Company') ? '查询单位' : '查询分类'}
        width={670}
        destroyOnClose={true}
        open={showModal != ''}
        bodyStyle={{ padding: 0 }}
        okText="确定"
        onOk={async () => {
          setShowModal('');
        }}
        onCancel={() => {
          setShowModal('');
        }}>
        {showModal.includes('Company') && (
          <SearchCompany
            searchCallback={(e) => {
              switch (showModal) {
                case 'sourceCompany':
                  setSourceCompany(new BaseTarget(e[0]));
                  break;
                case 'targetCompany':
                  setTargetCompany(new BaseTarget(e[0]));
                  break;
              }
            }}
            searchType={TargetType.Company}
          />
        )}
        {showModal.includes('sourceSpecies') && sourceCompany && (
          <SearchSpecies
            open={showModal.includes('sourceSpecies')}
            close={() => setShowModal('')}
            ok={(e: ISpeciesItem) => {
              setSourceSpecies(e);
              setShowModal('');
            }}
            currentCompany={sourceCompany}
          />
        )}
        {showModal.includes('targetSpecies') && targetCompany && (
          <SearchSpecies
            open={showModal.includes('targetSpecies')}
            close={() => setShowModal('')}
            ok={(e: ISpeciesItem) => {
              setTargetSpecies(e);
              setShowModal('');
            }}
            currentCompany={targetCompany}
          />
        )}
      </Modal>
    </>
  );
};
export default forwardRef(Matcher);
