/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-14 16:43:05
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 09:51:54
 * @FilePath: /oiocns-react/src/pages/Setting/Dept/components/EditCustomModal/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置
 * 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';

import cls from './index.module.less';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import positionCtrl from '@/ts/controller/position/positionCtrl';
// import UploadAvatar from '../UploadAvatar';

/* 
  编辑
*/
interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
}
const EditCustomModal = (props: Iprops) => {
  const { open, title, onOk, handleOk } = props;

  useEffect(() => {}, []);
  const getColumn = (): ProFormColumnsType<IIdentity>[] => {
    const columns: ProFormColumnsType<IIdentity>[] = [
      {
        title: '岗位名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '名称为必填项',
            },
          ],
        },
        width: 'm',
      },
      {
        title: '岗位编号',
        dataIndex: 'code',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '编码为必填项',
            },
          ],
        },
        width: 'm',
      },
    ];
    return columns;
  };
  return (
    <div className={cls['edit-custom-modal']}>
      <Modal
        title={title}
        open={open}
        getContainer={false}
        width={450}
        destroyOnClose={true}
        onCancel={() => handleOk()}
        footer={null}>
        <BetaSchemaForm<any>
          shouldUpdate={false}
          layoutType="Form"
          onFinish={async (values) => {
            positionCtrl.joinApply({
              name: values.name,
              code: values.code,
              indentitys: [],
            });
            onOk();
            console.log(positionCtrl);
          }}
          columns={getColumn()}
        />
      </Modal>
    </div>
  );
};

export default EditCustomModal;
