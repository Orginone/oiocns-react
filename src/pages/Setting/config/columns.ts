import { schema } from '@/ts/base';
import { ISpeciesItem } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-table';
import orgCtrl from '@/ts/controller';
import { IWorkDefine } from '@/ts/core/thing/app/work/workDefine';

const getSpeciesName = (
  id: string,
  species: ISpeciesItem[],
): ISpeciesItem | undefined => {
  for (const item of species) {
    if (id === item.metadata.id) {
      return item;
    }
    const find = getSpeciesName(id, item.children);
    if (find != undefined) {
      return find;
    }
  }
  return undefined;
};

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
    title: '签名',
    dataIndex: 'remark',
    key: 'remark',
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
  { title: '单位群名称', dataIndex: 'name' },
  { title: '单位群编码', dataIndex: 'code' },
  {
    title: '单位群简介',
    ellipsis: true,
    dataIndex: 'remark',
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
    dataIndex: ['name'],
  },
  {
    title: '群组编号',
    dataIndex: ['code'],
  },
  {
    title: '群组简介',
    dataIndex: ['remark'],
  },
  {
    title: '群组归属',
    dataIndex: ['belong', 'name'],
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

export const PropertyColumns = (
  species: ISpeciesItem,
): ProColumns<schema.XProperty>[] => [
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
    title: '归属组织',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
    render: (_, record) => {
      return orgCtrl.user.findShareById(record.belongId).name;
    },
  },
  {
    title: '物资类别',
    dataIndex: 'speciesId',
    key: 'speciesId',
    width: 150,
    render: (_, record) => {
      const find = getSpeciesName(record.speciesId, [species]);
      if (find != undefined) {
        return find.metadata.name;
      }
      return '未知';
    },
  },
  {
    title: '属性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];

export const AttributeColumns = (
  species: ISpeciesItem,
): ProColumns<schema.XAttribute>[] => [
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
      const find = getSpeciesName(record.speciesId, [species]);
      if (find != undefined) {
        return find.metadata.name;
      }
      return '未知';
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
    dataIndex: 'shareId',
    key: 'shareId',
    width: 200,
    render: (_, record) => {
      return orgCtrl.user.findShareById(record.shareId).name;
    },
  },
  {
    title: '特性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];
export const FormColumns = (species: ISpeciesItem): ProColumns<schema.XForm>[] => [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '表单类别',
    dataIndex: 'speciesId',
    key: 'speciesId',
    width: 150,
    render: (_, record) => {
      const find = getSpeciesName(record.speciesId, [species]);
      if (find != undefined) {
        return find.metadata.name;
      }
      return '未知';
    },
  },
  {
    title: '共享用户',
    dataIndex: 'shareId',
    key: 'shareId',
    width: 200,
    render: (_, record) => {
      return orgCtrl.user.findShareById(record.shareId).name;
    },
  },
  {
    title: '归属用户',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
    render: (_, record) => {
      return orgCtrl.user.findShareById(record.belongId).name;
    },
  },
];

export const FormItemColumns: ProColumns<schema.XFormItem>[] = [
  { title: '字段名称', dataIndex: 'name', key: 'name', width: 140 },
  { title: '字段编码', dataIndex: 'code', key: 'code', width: 160 },
  { title: '字段类型', dataIndex: 'remark', key: 'remark', width: 120 },
  { title: '规则', dataIndex: 'rule', key: 'rule', ellipsis: true },
];

export const FlowColumn: ProColumns<IWorkDefine>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '办事名称',
    dataIndex: ['metadata', 'name'],
  },
  {
    title: '办事标识',
    dataIndex: ['metadata', 'code'],
  },
  {
    title: '创建时间',
    dataIndex: ['metadata', 'createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['metadata', 'remark'],
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
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
  },
];
