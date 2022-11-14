import API from '../../services';
import { message } from 'antd';
import { CommonResponse } from '../typings';
/**
 * 文件对象操作
 */
export default class ObjectLay {
  private link: any;
  public Name: string;
  public Key: string;
  public DateCreated: string;
  public DateModified: string;
  public IsDirectory: boolean;
  public HasSubDirectories: boolean;
  public parent: ObjectLay;
  public children: ObjectLay[];
  public treeData: ObjectLay[];
  public constructor(data: any = null, parent: ObjectLay) {
    this.parent = parent;
    this.children = [];
    this.treeData = [];
    this.Key = data?.key ?? '';
    this.Name = data?.name ?? '主文件夹';
    this.IsDirectory = data?.isDirectory ?? true;
    this.DateCreated = data?.dateCreated ?? '';
    this.DateModified = data?.dateModified ?? '';
    this.HasSubDirectories = data?.hasSubDirectories ?? true;
  }
  /**
   * 是否包含上级目录
   */
  public get HasParent() {
    return this.parent != null;
  }
  /**
   * 是否包含下级目录
   */
  public get HasChildren() {
    return this.children && this.children.length > 0;
  }
  /**
   * 获取上级目录
   * @returns 返回上级目录
   */
  public GetParent() {
    return this.HasParent ? this.parent : this;
  }
  /**
   * 获取下级对象数据
   * @returns 下级对象数组
   */
  public async GetChildren(refresh: boolean = false) {
    console.log('获取children', this.children);

    if (!this.children[0]?.Name || refresh) {
      let res: CommonResponse = await API.bucket.bucketObjects({
        params: {
          shareDomain: 'user',
          prefix: this.formatKey(),
        },
      });
      if (res.success && res.data) {
        this.children = [];
        res.data.forEach((item: any) => {
          this.children.push(new ObjectLay(item, this));
        });
      } else if (res.msg != '') {
        message.error('加载下级目录异常');
      }
    }
    return this.children;
  }
  /**
   * 进入目录
   * @param key 目录key
   */
  public async EnterChildren(key: string) {
    let retItem = this;
    if (this.children && this.children.length > 0) {
      this.children.forEach((item: any) => {
        if (item.key == key) {
          retItem = item;
        }
      });
    }
    return retItem;
  }
  /**
   * 创建下级对象
   * @param name 对象名称
   */
  public async Create(name: string) {
    if (name != '') {
      let res: CommonResponse = await API.bucket.bucketCreate({
        params: {
          shareDomain: 'user',
          prefix: this.formatKey(name),
        },
      });
      if (!res.success && res.msg != '') {
        message.error('新建下级目录异常');
      }
    }
  }
  /**
   * 重命名
   * @param name 新名称
   */
  public async Rename(name: string) {
    if (this.Name != name) {
      let res: CommonResponse = await API.bucket.bucketRename({
        params: {
          shareDomain: 'user',
          prefix: this.formatKey(),
        },
        data: {
          name: name,
          isDirectory: this.IsDirectory,
        },
      });
      if (!res.success && res.msg != '') {
        message.error('对象重命名异常');
      }
    }
  }
  /**
   * 复制对象
   * @param newPath 新的路径
   */
  public async Copy(newPath: string) {
    let res: CommonResponse = await API.bucket.bucketCopy({
      params: {
        shareDomain: 'user',
        prefix: this.formatKey(),
      },
      data: {
        destination: newPath,
        isDirectory: this.IsDirectory,
      },
    });
    if (!res.success && res.msg != '') {
      message.error('对象复制异常');
    }
  }
  /**
   * 移动对象
   * @param newPath 新的路径
   */
  public async Move(newPath: string) {
    let res: CommonResponse = await API.bucket.bucketMove({
      params: {
        shareDomain: 'user',
        prefix: this.formatKey(),
      },
      data: {
        destination: newPath,
        isDirectory: this.IsDirectory,
      },
    });
    if (!res.success && res.msg != '') {
      message.error('对象移动异常');
    }
  }
  /**
   * 删除对象
   */
  public async Delete() {
    let res: CommonResponse = await API.bucket.bucketDelete({
      params: {
        shareDomain: 'user',
        prefix: this.formatKey(),
      },
    });
    if (!res.success && res.msg != '') {
      message.error('对象删除异常');
    }
  }
  /**
   * 下载对象
   */
  public async Download() {}
  /**
   * 上传对象
   */
  public async Upload() {
    return this.formatKey();
  }
  /**
   * 分享
   */
  public async Share() {
    if (!this.link) {
      let res: CommonResponse = await API.bucket.bucketShare({
        params: {
          shareDomain: 'user',
          prefix: this.formatKey(),
        },
      });
      if (res.success) {
        this.link = res.data;
      }
    }
    return this.link;
  }
  /**
   * 转存至当前路径
   * @param link 分享的对象链接
   */
  public async Redeposit() {}
  /**
   * 格式化key,主要针对路径中的中文
   * @returns 格式化后的key
   */
  private formatKey(subName: string = '') {
    if (!this.Key && !subName) {
      return '';
    }
    try {
      let keys = !this.Key ? [] : [this.Key];
      if (subName != '' && subName.length > 0) {
        keys.push(subName);
      }
      return btoa(unescape(encodeURIComponent(keys.join('/'))));
    } catch (err) {
      return '';
    }
  }
}
