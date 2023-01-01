import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Input,
  InputNumber,
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
import { DonationFormAssetColumns } from '@/pages/Welfare/config/columns';
import { dateFormat } from '@/utils/tools';
import moment from 'moment';
import { model, schema, kernel } from '@/ts/base';
import { TargetType } from '@/ts/core';
import { SupportFormModel } from '@/pages/Welfare/config/model';
import { FlowInstanceModel } from '@/ts/base/model';
import { supportFormCollName } from '@/pages/Welfare/config/collNames';
import { Status } from '@/pages/Welfare/config/status';
import userCtrl from '@/ts/controller/setting';
export type IProps = {
  formdata: SupportFormModel;
  backtolist: Function;
};
/**
 * 资助单信息(受捐方申请)
 * @returns
 */
const SupportSetting: React.FC<IProps> = ({ formdata, backtolist }) => {
  const [stores, setStores] = useState<any[]>([]);
  const parentRef = useRef<any>(null);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `物资明细`,
      key: 'assetList',
    },
  ];

  // 按钮
  const renderBtns = () => {
    return <></>;
  };

  const save = async (): Promise<boolean> => {
    let res = await kernel.anystore.update(
      supportFormCollName,
      { match: { id: formdata.id }, update: { _set_: formdata } },
      'company',
    );
    return res.success;
  };

  const checkValid = (): boolean => {
    let checkFields = ['store'];
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

  /**提交并审核 */
  const submitAndExamine = async (e: any) => {
    if (checkValid()) {
      formdata.status = Status.Processing;
      let success = await save();
      /**发起流程 */
      if (success) {
        let param: FlowInstanceModel = {
          // 应用Id
          productId: '396284430303498240',
          // 功能标识编号
          functionCode: '公益组织资助审批单流程',
          // 空间Id
          SpaceId: userCtrl.space.id,
          // 展示内容
          content: 'https://www.npmjs.com/',
          // 内容类型
          contentType: 'Iframe',
          // 表单数据内容
          data: JSON.stringify(formdata),
          // 标题
          title: '公益组织资助审批单流程',
          // 回调地址
          hook: 'https://www.npmjs.com/',
        };
        let res = await kernel.createInstance(param);
        if (res.success) {
          message.success('提交并发起流程成功');
        } else {
          message.error('发起流程失败');
        }
      } else {
        message.error('保存失败');
      }
    }
  };

  //Descriptions按钮
  const buttons = [
    <Button
      style={{ marginRight: '10px' }}
      key="submit"
      type="primary"
      onClick={submitAndExamine}>
      审批
    </Button>,
    <Button
      key="store"
      onClick={async () => {
        message.warn('该功能尚未开放');
      }}>
      暂存
    </Button>,
    <Divider key="vertical" type="vertical" />,
    <Button
      key="backlist"
      type="link"
      onClick={async () => {
        backtolist();
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
        onClick: async () => {
          message.warn('该功能尚未开放');
        },
      },
    ];
    return operations;
  };

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

  return (
    <div className={cls[`content-box`]}>
      <Card bordered={false} className={cls['content']}>
        <Descriptions
          title="公益资助审批单"
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
          <Descriptions.Item label="单据编号">
            <Input placeholder="请输入单据编号" defaultValue={formdata.no} />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>申请人/单位
              </span>
            }>
            <Input
              placeholder="请输入申请人或单位"
              defaultValue={formdata.applicant}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>需求物品
              </span>
            }>
            <Input placeholder="请输入需求物品" defaultValue={formdata.needsomething} />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>需求数量
              </span>
            }>
            <InputNumber min={0} defaultValue={formdata.amount || 0} />
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>物资使用方式
              </span>
            }>
            <Input placeholder="请输入物资使用方式" defaultValue={formdata.useWay} />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>发放地址
              </span>
            }>
            <Input placeholder="请输入发放地址" defaultValue={formdata.useAddress} />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>需求截止时间
              </span>
            }>
            <DatePicker
              defaultValue={moment(formdata.expireTime, dateFormat)}
              format={dateFormat}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>联系人
              </span>
            }>
            <Input placeholder="请输入联系人名称" defaultValue={formdata.linkman} />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>联系方法
              </span>
            }>
            <Input placeholder="请输入联系人方式" defaultValue={formdata.phone} />
          </Descriptions.Item>
          <Descriptions.Item label="选择仓储">
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
              onChange={(event) => {
                formdata.store = event;
              }}
              options={stores}
            />
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>申请原因
              </span>
            }
            span={2}>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="请输入申请原因"
              defaultValue={formdata.reason}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div className={cls['pages-wrap']}>
        <PageCard bordered={false} tabList={TitleItems} tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<any>
              dataSource={formdata.assets}
              rowKey={'id'}
              parentRef={parentRef}
              operation={renderOperation}
              tableAlertOptionRender={({
                selectedRowKeys,
                selectedRows,
                onCleanSelected,
              }: any) => {
                return (
                  <Space size={16}>
                    <a
                      onClick={() => {
                        message.warn('此功能尚未开放');
                      }}>
                      暂存勾选
                    </a>
                    <a onClick={onCleanSelected}>清空</a>
                  </Space>
                );
              }}
              columns={DonationFormAssetColumns}
              showChangeBtn={true}
              rowSelection={{}}
            />
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default SupportSetting;
