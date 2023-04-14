import { debounce, getNowTime, getUuid } from '@/utils/tools';
import { CompTypeItem, DataType, CompTypes, SCHEME } from './content/list/funs';
import { Emitter } from '@/ts/base/common';
import setting from '@/ts/controller/setting';
import { kernel } from '@/ts/base';
import { DomainTypes, emitter } from '@/ts/core';
import { Input, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { ICommonParams } from 'typings/common';
import moment from 'moment';

class HomeSettingServices extends Emitter {
  constructor() {
    super();
    this.getCustomComp();
    this.getHomeSetting();
    emitter.subscribePart([DomainTypes.Company, DomainTypes.User], () => {
      setTimeout(() => {
        this.getCustomComp();
        this.getHomeSetting();
      }, 50);
    });
  }
  private _homeSetting: any = {};
  public PageStyleData: any = {};
  private _PageData: CompTypeItem[] = []; // 页面 展示数据-组件数组
  private _EditInfo: DataType = {} as any; //所选预览 门户数据
  private _resultData: CompTypeItem[] = []; // 拖拽后 最终待保存数据
  private _SelectedComp: CompTypeItem | any = {}; // 记录当前所选 可编辑-单个组件
  public currentKey: string = '';
  // 默认组建信息
  public dataSource: DataType[] = [
    {
      title: '系统组件',
      list: [
        { name: '轮播图', w: 24, h: 30, type: CompTypes.System },
        { name: '常用推荐', w: 6, h: 14, type: CompTypes.System },
        { name: '应用列表', w: 6, h: 14, type: CompTypes.System },
        { name: '快捷入口', w: 6, h: 14, type: CompTypes.System },
        { name: '咨询问答', w: 6, h: 14, type: CompTypes.System },
        { name: '政策咨询', w: 6, h: 14, type: CompTypes.System },
        { name: '投诉反馈', w: 6, h: 14, type: CompTypes.System },
        { name: '通知公告', w: 6, h: 14, type: CompTypes.System },
        { name: '待办事项', w: 6, h: 14, type: CompTypes.System },
        { name: '卡片列表', w: 8, h: 18, type: CompTypes.System },
        { name: '卡片带title列表', w: 8, h: 18, type: CompTypes.System },
        { name: '空白页', w: 4, h: 10, type: CompTypes.System },
      ],
    },
    {
      title: '图形组件',
      list: [
        { name: '饼图', w: 4, h: 24, type: CompTypes.System },
        { name: '折线图', w: 6, h: 20, type: CompTypes.System },
        { name: '柱形图', w: 8, h: 18, type: CompTypes.System },
        { name: '饼图2', w: 4, h: 24, type: CompTypes.System },
        { name: '折线图', w: 6, h: 20, type: CompTypes.System },
        { name: '折线图2', w: 6, h: 20, type: CompTypes.System },
        { name: '卡片标题', w: 8, h: 18, type: CompTypes.System },
      ],
    },
    {
      title: '自定义组件',
      list: [
        { name: '驾驶舱', w: 14, h: 100, type: CompTypes.System },
        {
          name: 'Link',
          link: 'https://procomponents.ant.design/components/schema',
          w: 4,
          h: 10,
          type: CompTypes.Ifream,
        },
      ],
    },
  ];
  get homeSetting() {
    return this._homeSetting;
  }
  /**
   * @desc: 编辑页面 获取展示数据
   */
  public get PageData(): CompTypeItem[] {
    return this._PageData;
  }
  /**
   * @desc: 编辑页面 获取待修改数据
   */
  public get EditInfo(): DataType {
    return this._EditInfo;
  }
  /**
   * @desc: 编辑页面 获取当前选中组件
   */
  public get SelectedComp(): CompTypeItem {
    return this._SelectedComp;
  }
  //设置 最终 展示数据
  public set setResultData(list: CompTypeItem[]) {
    this._resultData = list;
  }

  //设置 修改 展示数据
  public set setPageData(v: any[]) {
    this._PageData = v;
  }
  //设置 修改 当前所选组件数据
  public set setSelectedComp(comp: CompTypeItem) {
    this._SelectedComp = comp;
    this.changCallbackPart('SelectedComp');
  }
  // 设置待修改 数据
  public set setEditInfo(v: DataType) {
    this._EditInfo = v;
    this._PageData = v?.list || [];
    this.PageStyleData = v?.styleData || {};
    this.changCallbackPart('EditData');
  }
  public handleRenamePage = (name: string) => {
    this._EditInfo.title = name;
  };
  // 增加 展示数据
  public AddCompItem = debounce((comp: CompTypeItem) => {
    let obj = {
      x: 0,
      y: 0,
      w: comp?.w || 4,
      h: comp?.h || 10,
      i: '',
    };
    if (!comp.i) {
      obj.i = getUuid();
    }
    this._PageData.push({ ...comp, ...obj });
    this.changCallbackPart('PageData');
    this.changCallback();
  }, 300);

  // 移除 展示数据
  public RemoveCompItem = (item: CompTypeItem) => {
    this._PageData = this._PageData.filter((v) => v.i !== item.i);
    this.changCallbackPart('PageData');
    this.changCallback();
  };
  // 更新 展示数据
  public UpdateCompItem = debounce((changeData: any) => {
    let style: React.CSSProperties = {};
    let compData = this.SelectedComp?.data || {};
    compData = { ...compData, ...changeData };

    for (const key in changeData) {
      if (Object.prototype.hasOwnProperty.call(changeData, key)) {
        const data = changeData[key];
        switch (key) {
          case 'backgroundColor':
            style.backgroundColor = data.hex;
            compData['backgroundColor'] = data.hex;
            break;
          case 'backgroundImage':
            style['backgroundImage'] = data && `url(${data})`;
            break;
          case 'backgroundImages':
            style['backgroundImage'] = data[0]?.url && `url(${data[0].url})`;
            break;
          case 'slideshow':
            // this.SelectedComp.imgs = data.map((v: { url: string }) => v.url);
            break;

          default:
            break;
        }
      }
    }
    if (this.SelectedComp.i) {
      this.SelectedComp.style = style;
      this.SelectedComp['data'] = compData;
    } else {
      this.PageStyleData = { ...this.PageStyleData, ...compData };
    }

    console.log('更新 展示数据UpdateCompItem', changeData, compData);
    this.changCallbackPart('PageData');
    this.changCallback();
  }, 50);

  /**
   * @desc: 页面提示确认框
   * @param {'clear' | 'save' | 'back'} str 提示语句类型： 清空、保存/更新、返回页面
   */
  public PageConfirm = (str: 'clear' | 'save' | 'back') => {
    let that = this;
    const confirmStr =
      str === 'clear'
        ? '即将删除所有展示内容'
        : str === 'save'
        ? '即将保存展示内容'
        : '返回页面';
    let title = that._EditInfo.title;
    Modal.confirm({
      title: str === 'save' ? '当前页面名称：' : '操作提示',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确认',
      content:
        str === 'save' ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            <div>
              <Input
                showCount
                maxLength={15}
                defaultValue={title}
                onChange={(v) => {
                  title = v.target.value;
                }}
              />
            </div>
          </div>
        ) : (
          `${confirmStr},是否确认？`
        ),
      onOk() {
        switch (str) {
          case 'clear':
            that.setPageData = [];
            that.changCallbackPart('PageData');
            that.changCallback();
            break;
          case 'save':
            that.handleSaveData(title ?? that._EditInfo.title);
            break;
          case 'back':
            that.changCallbackPart('Goback');
            break;

          default:
            break;
        }
      },
    });
  };

  /**
   * @desc: 处理保存函数 更新、新增
   * @param {string} title 页面名称
   */
  public handleSaveData = (title: string) => {
    // 触发更新数据
    if (this._EditInfo.id) {
      this.handleUpData(title);
      return;
    }
    // 创建新页面数据
    const params = {
      title,
      id: getUuid(),
      CREAT_NAME: setting.user.name,
      UPDATE_TIME: getNowTime(),
      styleData: this.PageStyleData,
      list: this._resultData.map((v) => {
        const obj: any = this._PageData.find((i) => i.i === v.i);
        return { ...v, data: obj?.data || {} };
      }),
    };
    kernel.anystore
      .insert(
        SCHEME,
        params,
        setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
      )
      .then((res) => {
        if (res.success) {
          message.success('操作完成');
          this.getHomeSetting();
        }
      });
  };
  // 更新 已保存数据
  public handleUpData = debounce((title: any) => {
    kernel.anystore
      .update(
        SCHEME,
        {
          match: { id: this._EditInfo.id },
          update: {
            _set_: {
              title,
              list: this._resultData.map((v) => {
                const obj: any = this._EditInfo.list.find((i) => i.i === v.i);
                return { ...v, data: obj?.data || {} };
              }),
              styleData: this.PageStyleData,
              UPDATE_TIME: getNowTime(),
            },
          },
        },
        setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
      )
      .then((res) => {
        if (res.success) {
          message.success('操作完成');
          this.changCallbackPart('PageData');
          this.getHomeSetting();
        }
      });
  }, 300);
  // 保存排序数据
  public handleSaveSortData = (arr: any[]) => {
    kernel.anystore.remove(
      SCHEME,
      { id: { _in_: arr.map((v) => v.id) } },
      setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
    );
    kernel.anystore.insert(
      SCHEME,
      arr.map((v, idx) => {
        return { ...v, sort: idx };
      }),
      setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
    );
    this.setPageData = arr;
    this._homeSetting = arr;
    this.getHomeSetting();
  };
  /**
   * getCustomComp 获取自定义组件列表
   */
  public getCustomComp() {
    kernel.anystore
      .aggregate(
        'custom_ifream',
        { match: {}, skip: 0, limit: 100 },
        setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
      )
      .then((result) => {
        let aimData = this.dataSource.find((item) => item.title === '自定义组件')!;
        if (result?.data?.length > 0) {
          aimData.list = [...result.data];
        } else {
          aimData.list = [];
        }
        this.changCallbackPart('DataSource');
      });
  }
  /**
   * creatIfream
   */
  public creatIfream(data: any) {
    let params = {
      ...data,
      UPDATE_TIME: getNowTime(),
    };
    if (data.id) {
      kernel.anystore
        .update(
          'custom_ifream',
          {
            match: { id: data.id },
            update: {
              _set_: params,
            },
          },
          setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
        )
        .then((res) => {
          if (res.success) {
            message.success('操作完成');
            const aimData = this.dataSource
              .find((item) => item.title === '自定义组件')
              ?.list!.filter((v: any) => v.id !== data.id);
            aimData!.push(params);
            this.changCallbackPart('DataSource');
          }
        });
    } else {
      kernel.anystore
        .insert(
          'custom_ifream',
          { id: getUuid(), CREAT_NAME: setting.user.name, ...params },
          setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
        )
        .then((res) => {
          if (res.success) {
            message.success('操作完成');
            const aimData = this.dataSource.find((item) => item.title === '自定义组件');
            aimData?.list.push(params);
            this.changCallbackPart('DataSource');
          }
        });
    }
  }
  /**
   * @desc: 获取门户配置信息
   */
  public getHomeSetting(isDominAll = false) {
    kernel.anystore
      .aggregate(
        SCHEME,
        {
          match: { isPublish: true },
          sort: { sort: 1 },
          skip: 0,
          limit: 20,
        },
        isDominAll
          ? DomainTypes.All
          : setting.isCompanySpace
          ? DomainTypes.Company
          : DomainTypes.User,
      )
      .then((res) => {
        if (res.success) {
          if (res.data.length === 0) {
            this.getHomeSetting(true);
          } else {
            this._homeSetting = res.data;
          }
        } else {
          this._homeSetting = [];
        }
        this.changCallbackPart('Goback');
        this.changCallback();
      });
  }

  // 数据操作
  /**
   * 获取列表，底层
   * @param params
   */
  public query = async (params: ICommonParams, tableKey: string) => {
    // 删除操作：{} --删除全部
    // const RemoveParams = { ASSET_NAME: '23' };  //条件删除
    // kernel.anystore.remove(ASSETS_DATA, RemoveParams, 'company');
    // objUtils.removeNull(params);
    const { current = 1, pageSize = 100000, ...resParams } = params;
    let skip = current > 1 ? (current - 1) * pageSize : 0;
    const matchParams = {
      match: { ...resParams },
      sort: { UPDATE_TIME: -1 },
      skip,
      limit: pageSize,
    };
    let resData = await kernel.anystore.aggregate(
      tableKey,
      matchParams,
      setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
    );
    // console.log('打印请求台账', tableKey, matchParams, resData);
    return { ...resData, total: resData?.data?.length || 0 };
  };
  /**
   * @description:根据id 更新数据
   * @param {string} aimObj 过滤条件{key：value}
   * @param {any} data 待更新数据{key：value}
   * @return {*}
   */
  update = async (aimObj: any, data: Object, tableKey: string) => {
    const nowTime = moment().format('YYYY/MM/DD HH:mm:ss');
    return await kernel.anystore.update(
      tableKey,
      { match: aimObj, update: { _set_: { ...data, UPDATE_TIME: nowTime } } },
      setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
    );
  };

  /**
   * @description: 删除数据 根据id
   * @param {string[]} id 删除的id数组
   * @return {*}
   */

  delById = async (ids: string[], tableKey: string) => {
    return kernel.anystore.remove(
      tableKey,
      { id: { _in_: ids } },
      setting.isCompanySpace ? DomainTypes.Company : DomainTypes.User,
    );
  };
}

const pageCtrl = new HomeSettingServices();
export default pageCtrl;
