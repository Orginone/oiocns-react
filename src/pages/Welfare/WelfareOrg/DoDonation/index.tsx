import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Dropdown,
  Input,
  InputNumber,
  MenuProps,
  message,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
} from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import TextArea from 'antd/lib/input/TextArea';
import { DoDonationAssetColumns } from '@/pages/Welfare/config/columns';
import { doDonationCollName } from '@/pages/Welfare/config/collNames';
import { Status } from '@/pages/Welfare/config/status';
import userCtrl from '@/ts/controller/setting';
import { DownOutlined } from '@ant-design/icons';
import { kernel, model, schema } from '@/ts/base';
import { dateFormat, getUuid } from '@/utils/tools';
import moment from 'moment';
import { TargetType } from '@/ts/core';
import FlowTodo from '@/pages/Setting/content/Flow/Todo';
import { FlowInstanceModel, ResultType } from '@/ts/base/model';
/**
 * 发起捐赠(公益方发起捐赠)
 * @returns
 */

const DoDonationSetting: React.FC = () => {
  // let editable = true;
  let formdata: any = {
    no: null,
    sponsor: userCtrl.isCompanySpace ? userCtrl.company.name : userCtrl.user.name,
    donors: null, //捐赠对象
    store: null,
    needAssess: '1', //是否需要评估
    netWorth: 0, //净值
    totalValue: 0, //总值
    amount: 0,
    reason: null,
    remark: null,
  };
  const [editable, setEditable] = useState<boolean>(
    !formdata.status || formdata.status == Status.Draft,
  );
  const [stores, setStores] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [key, forceUpdate] = useObjectUpdate(userCtrl.space);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    queryStores();
  }, []);

  const queryStores = async () => {
    let groupResult: model.ResultType<schema.XTargetArray> = await kernel.queryTargetById(
      { ids: ['395662892994793472'] },
    );
    if (groupResult.success && groupResult.data.result) {
      let group: schema.XTarget = groupResult.data.result[0];
      const companyResult = await kernel.querySubTargetById({
        page: {
          limit: 100,
          offset: 0,
          filter: '',
        },
        id: group.id,
        typeNames: [TargetType.Group],
        subTypeNames: [TargetType.Company],
      });
      if (companyResult.success && companyResult.data.result) {
        let stores: any = companyResult.data.result.map((item) => {
          return { value: item.id, label: item.name };
        });
        setStores(stores);
      }
    }
  };

  const parentRef = useRef<any>(null);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `物资明细`,
      key: 'assetList',
    },
  ];

  const items: MenuProps['items'] = [
    {
      label: '暂存箱添加',
      key: '1',
      onClick: () => {
        message.warn('该功能尚未开放');
      },
    },
    {
      label: '仓库添加',
      key: '2',
      onClick: () => {
        console.log('仓库添加');
      },
    },
  ];

  const save = async (): Promise<boolean> => {
    if (!formdata.creator) {
      formdata.creator = userCtrl.user.id;
      formdata.creatorName = userCtrl.user.name;
      formdata.creatTime = moment().format(dateFormat);
    }
    let success = true;
    if (!formdata.id) {
      formdata.id = getUuid();
      let res = await kernel.anystore.insert(doDonationCollName, formdata, 'user');
      success = res.success;
    } else {
      let res = await kernel.anystore.update(
        doDonationCollName,
        { match: { id: formdata.id }, update: { _set_: formdata } },
        'user',
      );
      success = res.success;
    }

    return success;
  };

  const load = async () => {
    let res = await kernel.anystore.aggregate(
      doDonationCollName,
      {
        match: {},
        skip: 0,
        limit: 100,
      },
      'user',
    );
    console.log(res);
  };

  /**提交并审核 */
  const submitAndExamine = async (e: any) => {
    if (checkValid()) {
      formdata.status = Status.Draft;
      let success = await save();
      /**发起流程 */
      if (success) {
        let param: FlowInstanceModel = {
          // 应用Id
          productId: '396284430303498240',
          // 功能标识编号
          functionCode: '公益组织发起捐赠',
          // 空间Id
          SpaceId: userCtrl.space.id,
          // 展示内容
          content: 'https://www.npmjs.com/',
          // 内容类型
          contentType: 'Iframe',
          // 表单数据内容
          data: JSON.stringify(formdata),
          // 标题
          title: '公益组织发起捐赠流程',
          // 回调地址
          hook: 'https://www.npmjs.com/',
        };
        console.log('param', param);
        let res = await kernel.createInstance(param);
        if (res.success) {
          setEditable(false);
          message.success('提交并发起流程成功');
        } else {
          message.error('发起流程失败');
        }
      } else {
        message.error('保存失败');
      }
    }
  };
  /**暂存 */
  const stash = async (e: any) => {
    message.warn('该功能尚未开放');
    load();
    // await save();
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const checkValid = (): boolean => {
    let checkFields = ['no', 'sponsor', 'donors', 'store', 'reason'];
    for (let field of checkFields) {
      if (
        formdata[field] == null ||
        formdata[field] == undefined ||
        formdata[field] == ''
      ) {
        message.warn('请先完成表单');
        return false;
      }
    }
    return true;
  };

  // 按钮
  const renderBtns = () => {
    return (
      <div hidden={!editable}>
        <Dropdown menu={{ items }}>
          <Button style={{ marginRight: '10px' }} key="addAsset" type="primary">
            <Space>
              添加资产
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>

        <Button
          key="exportBatch"
          onClick={() => {
            message.warn('该功能尚未开放');
          }}>
          批量导入/导出
        </Button>
      </div>
    );
  };

  //Descriptions按钮
  const buttons = [
    <Button
      style={{ marginRight: '10px' }}
      key="submit"
      type="primary"
      hidden={!editable}
      onClick={submitAndExamine}>
      提交并审核
    </Button>,
    <Button key="store" onClick={stash} hidden={!editable}>
      暂存
    </Button>,
    <Divider key="vertical" type="vertical" />,
    <Button
      key="backlist"
      type="link"
      onClick={async () => {
        message.warn('该功能尚未开放');
      }}>
      返回列表
    </Button>,
  ];

  // 操作内容渲染函数
  const renderOperation = (item: any): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    operations = [
      {
        key: 'remove',
        label: '移除',
        onClick: async () => {},
      },
    ];
    return operations;
  };

  return (
    <div className={cls[`content-box`]}>
      <Card bordered={false} className={cls['content']}>
        <Descriptions
          key={key}
          title="单据信息"
          bordered
          column={2}
          size="small"
          labelStyle={{
            textAlign: 'left',
            color: '#606266',
            width: 150,
          }}
          contentStyle={{ textAlign: 'left', color: '#606266' }}
          extra={buttons}>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>单据编号
              </span>
            }>
            <Input
              placeholder="请输入单据编号"
              defaultValue={formdata.no}
              onChange={(event) => {
                formdata.no = event.target.value;
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>发起人/单位
              </span>
            }>
            <Input
              placeholder="请选择发起人或单位"
              defaultValue={formdata.sponsor}
              disabled
              onChange={(event) => {
                formdata.sponsor = event.target.value;
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>捐赠对象
              </span>
            }>
            <Input
              placeholder="请输入捐赠对象"
              defaultValue={formdata.donors}
              onChange={(event) => {
                formdata.donors = event.target.value;
              }}
            />
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>选择仓储
              </span>
            }>
            <Select
              showSearch
              placeholder="请选择仓储地点"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              defaultValue={formdata.store}
              options={stores}
              onChange={(event) => {
                formdata.store = event;
              }}
            />
          </Descriptions.Item>

          <Descriptions.Item label="是否评估">
            <Radio.Group
              defaultValue={formdata.needAssess}
              onChange={(event) => {
                formdata.needAssess = event.target.value;
              }}>
              <Radio value={'1'}>是</Radio>
              <Radio value={'0'}>否</Radio>
            </Radio.Group>
          </Descriptions.Item>
          <Descriptions.Item label="净值合计(元)">
            <InputNumber
              min={0}
              defaultValue={formdata.netWorth || 0}
              prefix="￥"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              style={{ width: '100%', backgroundColor: '#fff', border: 'none' }}
              onChange={(event) => {
                formdata.netWorth = event;
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="涉及资产总值(元)">
            <InputNumber
              min={0}
              defaultValue={formdata.totalValue || 0}
              prefix="￥"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              style={{ width: '100%', backgroundColor: '#fff', border: 'none' }}
              onChange={(event) => {
                formdata.totalValue = event;
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            <InputNumber
              min={0}
              defaultValue={formdata.amount || 0}
              onChange={(event) => {
                formdata.amount = event;
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item
            span={2}
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>申请原因
              </span>
            }>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="请输入申请原因"
              defaultValue={formdata.reason}
              onChange={(event) => {
                formdata.reason = event.target.value;
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="请输入备注信息"
              defaultValue={formdata.remark}
              onChange={(event) => {
                formdata.remark = event.target.value;
              }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div className={cls['pages-wrap']}>
        <PageCard bordered={false} tabList={TitleItems} tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<any>
              dataSource={assetList}
              rowKey={'id'}
              // request={(page) => {
              //   return new Promise(function (resolve, reject) {
              //     // 异步处理,处理结束后、调用resolve 或 reject
              //     setTimeout(() => {
              //       resolve({
              //         result: [
              //           {
              //             id: '12345678910',
              //             code: '12345678910',
              //             name: '资产名称1',
              //             spec: '500T',
              //             amount: 100,
              //             storeAddress: '仓库A',
              //             remark: '这是备注这是备注',
              //           },
              //           {
              //             id: '12345678911',
              //             code: '12345678911',
              //             name: '资产名称2',
              //             spec: '500T',
              //             amount: 100,
              //             storeAddress: '仓库B',
              //             remark: '这是备注这是备注这是备注这是备注这是备注这是备注',
              //           },
              //           {
              //             id: '12345678912',
              //             code: '12345678912',
              //             name: '资产名称3',
              //             spec: '500T',
              //             amount: 100,
              //             storeAddress: '仓库C',
              //             remark: '这是备注',
              //           },
              //         ],
              //         offset: 0,
              //         limit: 10,
              //         total: 100,
              //       });
              //     }, 1000);
              //   });
              // }}
              parentRef={parentRef}
              operation={renderOperation}
              tableAlertOptionRender={({
                selectedRowKeys,
                selectedRows,
                onCleanSelected,
              }: any) => {
                return (
                  <Space size={16}>
                    <a>暂存勾选</a>
                    <a onClick={onCleanSelected}>清空</a>
                  </Space>
                );
              }}
              columns={DoDonationAssetColumns}
              showChangeBtn={true}
              rowSelection={{}}
            />
          </div>
        </PageCard>
      </div>
      <FlowTodo
        open={open}
        onClose={closeDrawer}
        instance={formdata.flowinstance}></FlowTodo>
    </div>
  );
};

export default DoDonationSetting;
