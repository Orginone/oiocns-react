import { XDirectory, XProperty, XSpecies, XSpeciesItem } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core';
import { assignment } from '../..';
import { Context, SheetHandler, Sheet, SheetName } from '../../types';

export interface Directory extends XDirectory {
  parentCode?: string;
}

export class DirectorySheet extends Sheet<Directory> {
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

export class DirectoryHandler extends SheetHandler<Directory, Context, DirectorySheet> {
  /**
   * 输出读取完成后进行一些初始化
   * @param c
   */
  async initContext(c: Context): Promise<void> {
    await this.deepLoad(this.sheet.directory, c);
    for (let item of this.sheet.data) {
      if (c.directoryMap.has(item.code)) {
        let old = c.directoryMap.get(item.code)!;
        assignment(old, item);
      }
      c.directoryMap.set(item.code, item);
    }
  }

  async deepLoad(root: IDirectory, c: Context): Promise<void> {
    // 加载目录
    for (const dir of root.target.directory.resource.directoryColl.cache) {
      c.directoryMap.set(dir.id, { ...dir });
    }
    c.directoryMap.forEach((item) => {
      c.directoryMap.set(item.code, {
        ...item,
        parentCode: c.directoryMap.get(item.directoryId)?.code,
      });
    });

    // 加载分类
    let speciesMap: { [key: string]: XSpecies } = {};
    for (const species of root.target.resource.speciesColl.cache) {
      if (c.directoryMap.has(species.directoryId)) {
        speciesMap[species.id] = species;
        c.speciesMap.set(species.code, {
          ...species,
          directoryCode: c.directoryMap.get(species.directoryId)!.code,
        });
        c.speciesItemMap.set(species.code, new Map());
        let parentMap: { [id: string]: XSpeciesItem } = {};
        let items = await root.resource.speciesItemColl.load({
          options: { match: { speciesId: species.id } },
        });
        items.forEach((item) => (parentMap[item.id] = item));
        for (let speciesItem of items) {
          c.speciesItemMap.get(species.code)?.set(speciesItem.info, {
            ...speciesItem,
            parentInfo: parentMap[speciesItem.parentId]?.info,
            speciesCode: species.code,
            index: 0,
          });
        }
      }
    }

    // 加载属性
    let propMap: { [id: string]: XProperty } = {};
    for (const property of root.target.resource.propertyColl.cache) {
      if (c.directoryMap.has(property.directoryId)) {
        propMap[property.id] = { ...property };
        c.propertyMap.set(property.info, {
          ...property,
          directoryCode: c.directoryMap.get(property.directoryId)!.code,
          speciesCode: speciesMap[property.speciesId]?.code,
        });
      }
    }

    // 加载表单
    for (const form of root.target.resource.formColl.cache) {
      if (c.directoryMap.has(form.directoryId)) {
        c.formMap.set(form.code, {
          ...form,
          directoryCode: c.directoryMap.get(form.directoryId)!.code,
        });
        c.formAttrMap.set(form.code, new Map());
        if (form.attributes) {
          for (let attribute of form.attributes) {
            if (attribute.property?.info) {
              c.formAttrMap.get(form.code)?.set(attribute.property?.info, {
                ...attribute,
                directoryId: form.directoryId,
                formCode: form.code,
                propInfo: attribute.property?.info,
              });
            }
          }
        }
      }
    }
  }

  /**
   * 数据校验
   * @param data 数据
   */
  checkData(context: Context) {
    for (let index = 0; index < this.sheet.data.length; index++) {
      let item = this.sheet.data[index];
      if (!item.name || !item.code) {
        this.pushError(index, '目录名称、目录代码不能为空！');
      }
      if (item.parentCode && !context.directoryMap.has(item.parentCode)) {
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
    for (let index = 0; index < this.sheet.data.length; index++) {
      let item = this.sheet.data[index];
      item.shareId = this.sheet.directory.metadata.shareId;
      if (item.parentCode) {
        item.directoryId = context.directoryMap.get(item.parentCode)!.id;
      } else {
        item.directoryId = this.sheet.directory.target.directory.id;
      }
      let res: any;
      if (item.id) {
        res = await this.sheet.directory.resource.directoryColl.replace(item);
      } else {
        res = await this.sheet.directory.resource.directoryColl.insert(item);
      }
      if (res) {
        this.sheet.data[index] = res;
        context.directoryMap.set(item.code, res);
      } else {
        this.pushError(index, '生成失败！');
      }
    }
  }
}
