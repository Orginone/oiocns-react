import { schema } from '@/ts/base';
import { IProduct } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-table';
import userCtrl from '@/ts/controller/setting';
import thingCtrl from '@/ts/controller/thing';

export const PersonColumns: ProColumns<schema.XTarget>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '账号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '昵称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '姓名',
    key: 'realName',
    render: (_key: any, _record: any, _: number) => {
      return _record.team.name;
    },
  },
  {
    title: '手机号',
    key: 'mobilephone',
    render: (_key: any, _record: any, _: number) => {
      return _record.team.code;
    },
  },
  {
    title: '签名',
    key: 'remark',
    render: (_key: any, _record: any, _: number) => {
      return _record.team.remark;
    },
  },
];

export const CompanyColumn: ProColumns<schema.XTarget>[] = [
  { title: '序号', valueType: 'index', width: 50 },
  { title: '单位简称', dataIndex: 'name' },
  {
    title: '社会统一信用代码',
    dataIndex: 'code',
  },
  { title: '单位全称', dataIndex: ['team', 'name'] },
  { title: '单位代码', dataIndex: ['team', 'code'] },
  {
    title: '单位简介',
    ellipsis: true,
    dataIndex: ['team', 'remark'],
  },
];

export const GroupColumn: ProColumns<schema.XTarget>[] = [
  { title: '序号', valueType: 'index', width: 50 },
  { title: '集团简称', dataIndex: 'name' },
  { title: '集团编码', dataIndex: 'code' },
  { title: '集团全称', dataIndex: ['team', 'name'] },
  { title: '集团代码', dataIndex: ['team', 'code'] },
  {
    title: '集团简介',
    ellipsis: true,
    dataIndex: ['team', 'remark'],
  },
];

export const CohortColumn: ProColumns<schema.XTarget>[] = [
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '群组名称',
    dataIndex: ['target', 'name'],
  },
  {
    title: '群组编号',
    dataIndex: ['target', 'code'],
  },
  {
    title: '群组简介',
    dataIndex: ['target', 'team', 'remark'],
  },
  {
    title: '归属',
    dataIndex: 'rule',
    key: 'rule',
    width: 180,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
];

export const ApplicationColumns: ProColumns<IProduct>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '应用图标',
    dataIndex: ['prod', 'belongId'],
  },
  {
    title: '应用名称',
    dataIndex: ['prod', 'name'],
  },
  {
    title: '版本号',
    dataIndex: ['prod', 'version'],
    width: 100,
  },
  {
    title: '应用类型',
    dataIndex: ['prod', 'typeName'],
  },
  {
    title: '应用来源',
    ellipsis: true,
    dataIndex: ['prod', 'source'],
  },
  {
    title: '创建时间',
    valueType: 'dateTime',
    dataIndex: ['prod', 'createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['prod', 'remark'],
  },
];

export const IdentityColumn: ProColumns<schema.XIdentity>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '角色编号',
    dataIndex: 'code',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '权限',
    dataIndex: 'name',
  },
  {
    title: '组织',
    dataIndex: 'belongId',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const PropertyColumns: ProColumns<any>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '属性代码',
    dataIndex: 'code',
    key: 'code',
    width: 180,
  },
  {
    title: '属性名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '属性类型',
    dataIndex: 'valueType',
    key: 'valueType',
    width: 150,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    width: 150,
  },
  {
    title: '选择字典',
    dataIndex: ['dict', 'name'],
    key: 'dictId',
    width: 150,
  },
  {
    title: '来源组织',
    dataIndex: 'shareId',
    key: 'shareId',
    width: 200,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.shareId);
      if (team && team.name != '奥集能平台') {
        return team.name;
      }
      return userCtrl.space.teamName;
    },
  },
  {
    title: '归属组织',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '属性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];

export const AttributeColumns: ProColumns<schema.XAttribute>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '特性编号',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '特性名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '特性分类',
    dataIndex: 'speciesId',
    key: 'speciesId',
    width: 150,
    render: (_, record) => {
      return thingCtrl.speciesList.find((a) => a.id == record.speciesId)?.name ?? '未知';
    },
  },
  {
    title: '属性',
    dataIndex: ['property', 'name'],
    key: 'propId',
    width: 150,
  },
  {
    title: '共享组织',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '特性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];
export const OperationColumns: ProColumns<schema.XOperation>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '业务编号',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '业务名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '特性分类',
    dataIndex: 'speciesId',
    key: 'speciesId',
    width: 150,
    render: (_, record) => {
      return thingCtrl.speciesList.find((a) => a.id == record.speciesId)?.name ?? '未知';
    },
  },
  {
    title: '共享组织',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
];

export const OperationItemColumns: ProColumns<schema.XOperationItem>[] = [
  { title: '字段名称', dataIndex: 'name', key: 'name', width: 140 },
  { title: '字段编码', dataIndex: 'code', key: 'code', width: 160 },
  { title: '字段类型', dataIndex: 'remark', key: 'remark', width: 120 },
  {
    title: '共享组织',
    dataIndex: 'rule',
    key: 'rule',
    width: 180,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
  { title: '规则', dataIndex: 'rule', key: 'rule', ellipsis: true },
];

export const FlowColumn: ProColumns<schema.XFlowDefine>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '办事名称',
    dataIndex: 'name',
  },
  {
    title: '需求主体',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: 'remark',
  },
];

export const DictColumns: ProColumns<schema.XDict>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
  },
];

export const DictItemColumns: ProColumns<schema.XDictItem>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
  },
];
