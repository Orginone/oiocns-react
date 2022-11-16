/* eslint-disable no-unused-vars */
import { TargetType } from '../../enum';
// import BaseTarget from '../base';
import Company from '../company';
import { kernel, model, schema, common } from '../../../base';
import University from '../university';
import Hospital from '../hospital';

import Types from '../../../../module/typings';
import { XTarget } from '../../../base/schema';


/**
 * 我的设置里面的接口
 * const person: Person = Provider.getPerson;
 * import Provider from '@/ts/core/provider';
   import Person from '@/ts/core/target/person';   

   import Userdata from '@/ts/core/target/setting/userData';
   Userdata.getInstance().searchCompany();
 */
export default class userdata {

    // 单例
    private static _instance: userdata;
    /**单例模式 */
    public static getInstance() {
        if (this._instance == null) {
            this._instance = new userdata();
        }
        return this._instance;
    }

    /**构造方法 */
    constructor() {

    }
    
    /**
     * 搜索单位(公司) 数组里面还有target 
     * @returns 根据编码搜索单位, 单位、公司表格需要的数据格式
     */
    public async searchCompany(page: Types.Page): Promise<Types.PageData<XTarget>> {
        // 入参
        let paramData: any = {};
        paramData.name = page.filter;
        paramData.typeName = TargetType.Company;
        paramData.page = {
            offset: 0,
            filter: page.filter,
            limit: common.Constants.MAX_UINT_8,
        };
        // 结果集
        let pageData: any = {};
        try {
            let res = await kernel.searchTargetByName(paramData);

            if (res.success && res.data && res.data.result) {
                // 存放返回数组 
                let list: XTarget[] = [];
                res.data.result.map((item) => {
                    switch (item.typeName) {
                        case TargetType.University:
                            list.push(new University(item).target);
                            break;
                        case TargetType.Hospital:
                            list.push(new Hospital(item).target);
                            break;
                        default:
                            list.push(new Company(item).target);
                            break;
                    }
                });
                pageData.success = true;
                pageData.data = list;
            } else {
                pageData.success = false;
                pageData.msg = res.msg;
            }
        } catch (error) {
            pageData.success = false;
            pageData.msg = '接口调用错误';
        }
        return pageData;
    }


}