import { kernel, model } from '@/ts/base';
import { DirectoryModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { Context, ReadConfigImpl, SheetConfigImpl, SheetName } from '../../types';
import { XProperty, XSpecies, XSpeciesItem } from '@/ts/base/schema';
import { assignment } from '../..';

export interface Directory extends DirectoryModel {
  parentCode?: string;
}

export class DirectorySheetConfig extends SheetConfigImpl<Directory> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Directory, 1, [
      { title: '上级目录代码', dataIndex: 'parentCode', valueType: '描述型' },
      { title: '目录名称', dataIndex: 'name', valueType: '描述型' },
      { title: '目录代码', dataIndex: 'code', valueType: '描述型' },
      { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
      { title: '主键', dataIndex: 'id', valueType: '描述性', hide: true },
      { title: '上级目录主键', dataIndex: 'parentId', valueType: '描述性', hide: true },
    ]);
    this.directory = directory;
  }
}

export class DirectoryReadConfig extends ReadConfigImpl<
  Directory,
  Context,
  DirectorySheetConfig
> {
  constructor(sheetConfig: DirectorySheetConfig) {
    super(sheetConfig);
  }
  /**
   * 输出读取完成后进行一些初始化
   * @param c
   */
  async initContext(c: Context): Promise<void> {
    await this.deepLoad(this.sheetConfig.directory, c);
    for (let item of this.sheetConfig.data) {
      if (c.directoryCodeMap.has(item.code)) {
        let old = c.directoryCodeMap.get(item.code)!;
        assignment(old, item);
      }
      c.directoryCodeMap.set(item.code, item);
    }
  }
  async deepLoad(root: IDirectory, c: Context): Promise<void> {
    let queue = [root];
    let allDirs = [root];
    // 加载目录
    while (true) {
      let first = queue.shift();
      if (!first) continue;
      await first.loadContent();
      c.directoryCodeMap.set(first.code, {
        ...first.metadata,
        parentCode: first.parent?.metadata.code,
      });
      if (first?.children) {
        queue.push(...first.children);
        allDirs.push(...first.children);
      }
      if (queue.length == 0) {
        break;
      }
    }
    // 加载分类
    let speciesMap: { [key: string]: XSpecies } = {};
    for (let dir of allDirs) {
      for (let species of dir.specieses) {
        speciesMap[species.id] = species.metadata;
        c.speciesCodeMap.set(species.code, {
          ...species.metadata,
          directoryCode: dir.code,
        });
        await species.loadItems();
        c.speciesItemCodeMap.set(species.code, new Map());
        let parentMap: { [id: string]: XSpeciesItem } = {};
        species.items.forEach((item) => (parentMap[item.id] = item));
        for (let speciesItem of species.items) {
          c.speciesItemCodeMap.get(species.code)?.set(speciesItem.info, {
            ...speciesItem,
            parentInfo: parentMap[speciesItem.parentId]?.info,
            speciesCode: species.code,
            index: -1,
          });
        }
      }
    }
    // 加载属性
    let propMap: { [id: string]: XProperty } = {};
    for (let dir of allDirs) {
      for (let property of dir.propertys) {
        propMap[property.id] = property.metadata;
        c.propertyMap.set(property.metadata.info, {
          ...property.metadata,
          directoryCode: dir.code,
          speciesCode: speciesMap[property.metadata.speciesId]?.code,
        });
      }
    }
    // 加载表单
    for (let dir of allDirs) {
      for (let form of dir.forms) {
        c.formCodeMap.set(form.code, {
          ...form.metadata,
          directoryCode: dir.code,
        });
        await form.loadAttributes();
        c.formAttrCodeMap.set(form.code, new Map());
        for (let attribute of form.attributes) {
          c.formAttrCodeMap.get(form.code)?.set(attribute.code, {
            ...attribute,
            directoryId: dir.id,
            formCode: form.code,
            propInfo: propMap[attribute.propId]?.info,
          });
        }
      }
    }
  }

  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    for (let index = 0; index < this.sheetConfig.data.length; index++) {
      let item = this.sheetConfig.data[index];
      if (!item.name || !item.code) {
        this.pushError(index, '目录名称、目录代码不能为空！');
      }
      if (item.parentCode && !context.directoryCodeMap.has(item.parentCode)) {
        let error = `表格中未获取到上级目录代码：${item.parentCode}，上级目录代码需定义在子目录前！`;
        this.pushError(index, error);
      }
    }
    return this.errors;
  }
  /**
   * 更新/创建属性
   * @param _index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operating(context: Context): Promise<void> {
    let data = this.sheetConfig.data;
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      item.shareId = this.sheetConfig.directory.metadata.shareId;
      if (item.parentCode) {
        let parent = context.directoryCodeMap.get(item.parentCode)!;
        item.parentId = parent.id.replace('_', '');
      } else {
        item.parentId = this.sheetConfig.directory.id;
      }
      let res: model.ResultType<Directory> = await kernel.request({
        module: 'thing',
        action: item.id ? 'UpdateDirectory' : 'CreateDirectory',
        params: item,
      });
      if (res.success) {
        assignment(res.data, item);
        context.directoryCodeMap.set(item.code, res.data);
      } else {
        this.pushError(index, res.msg);
      }
    }
  }
}
