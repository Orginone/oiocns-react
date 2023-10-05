/** 规则执行结果的使用方式 */
export enum EffectEnum {
  'mainVals' = '设置主表数据', //设置主表数据
  'detailVals' = '设置子表数据', //设置子表数据
  'verifyMain' = '校验主表', //校验主表
  'verifyDetail' = '校验子表', //校验子表
  'changeMain' = '修改主表展示方案', //修改主表展示方案
  'limitEdit' = '限制子表编辑功能', //限制子表编辑功能
}
export const EffectEnumOption: any = {
  mainVals: "设置主表数据", //设置主表数据
  detailVals: "设置子表数据", //设置子表数据
  verifyMain: "校验主表", //校验主表
  verifyDetail: "校验子表", //校验子表
  changeMain: "修改主表展示方案", //修改主表展示方案
  limitEdit: "限制子表编辑功能", //限制子表编辑功能
};
