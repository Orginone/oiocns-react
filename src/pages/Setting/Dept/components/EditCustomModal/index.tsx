import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import cls from './index.module.less';
import SettingService from '../../service';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import Department from '@/ts/core/target/department';
import { IDepartment } from '@/ts/core/target/itarget';
const { TextArea } = Input;
interface Iprops {
  title: string;
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  selectId?: string;
  editDept?: IDepartment;
}

const EditCustomModal = (props: Iprops) => {
  const setting = SettingService.getInstance();
  const { open, title, handleOk, handleCancel, editDept } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      title !== '新增'
        ? form.setFieldsValue({
            ...editDept?.target,
            remark: editDept?.target.team?.remark ?? '',
          })
        : form.resetFields();
    }
  }, [open]);
  const submitData = async () => {
    const value = await form.validateFields();
    console.log(value);
    if (value) {
      // 编辑自己的部门信息
      if (title === '编辑') {
        if (editDept) {
          const { typeName, id, belongId } = editDept.target;
          const { success, msg } = await editDept.update({
            // ...editDept.target,
            typeName,
            id,
            belongId,
            teamName: value.name,
            teamCode: value.code,
            team: { ...editDept.target.team, remark: value.remark },
            ...value,
          });
          if (success) {
            message.success('更新信息成功');
            handleOk();
          } else {
            message.error(msg);
          }
        }
      } else {
        // 新增部门信息
        const newValue = {
          ...value,
          teamName: value.name,
          teamCode: value.code,
          belongId: userCtrl.Company?.target.id,
          typeName: TargetType.Department,
          parentId: editDept ? editDept.target.id : '',
        };
        // 查询是否重复创建
        const dept = setting.getRoot as Department;
        dept.searchTargetType = [TargetType.Department, TargetType.Company];
        let datas = await dept.searchTargetByName(newValue.code, [TargetType.Department]);
        if (!datas.success) {
          message.error(datas.msg);
          return;
        }
        if (datas?.data && datas.data?.total > 0) {
          message.error('重复创建');
          return;
        }
        datas = await dept.searchTargetByName(newValue.name, [TargetType.Department]);
        if (!datas.success) {
          message.error(datas.msg);
          return;
        }
        if (datas?.data && datas.data?.total > 0) {
          message.error('重复创建');
          return;
        }
        let curentValue: any;

        if (editDept) {
          // 新增下级部门信息
          curentValue = await editDept.createDepartment(newValue);
        } else {
          // 如果是一级部门， 就从根部门里面新增
          curentValue = await setting.getRoot.createDepartment(newValue);
        }
        if (!curentValue.success) {
          message.error(curentValue.msg);
        } else {
          message.success(curentValue.msg);
          handleOk();
        }
      }
    }
  };
  return (
    <div className={cls['edit-custom-modal']}>
      <Modal
        title={title}
        open={open}
        onOk={submitData}
        onCancel={() => handleCancel()}
        getContainer={false}
        destroyOnClose>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="部门名称"
                rules={[{ required: true, message: '请输入部门名称!' }]}>
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="部门编号"
                rules={[{ required: true, message: '请输入部门编号!' }]}>
                <Input placeholder="请输入部门编号" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="描述">
            <TextArea
              placeholder="请输入部门描述"
              autoSize={{ minRows: 2, maxRows: 3 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditCustomModal;
