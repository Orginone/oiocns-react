import { TargetType } from './enum';
// 异常消息常量
const UnauthorizedError = '抱歉,您没有权限操作.';
const IsExistError = '抱歉,已存在请勿重复创建.';
const ResultError = '抱歉,请求返回异常.';
const NotFoundError = '抱歉,未找到该数据.';

const CompanyTypes = [TargetType.Company, TargetType.Hospital, TargetType.University];

export default {
  UnauthorizedError,
  IsExistError,
  ResultError,
  NotFoundError,
  CompanyTypes,
};
