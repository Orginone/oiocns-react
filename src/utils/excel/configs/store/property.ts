import { PropertyModel } from '@/ts/base/model';
import {
  ReadConfigImpl,
  SheetConfigImpl,
  Context,
  SheetName,
  ExcelConfig,
} from '../../types';
import { IDirectory } from '@/ts/core';

interface Property extends PropertyModel {
  directoryName: string;
  speciesCode: string;
}

export class PropSheetConfig extends SheetConfigImpl<Property> {
  directory: IDirectory;

  constructor(directory: IDirectory) {
    super(SheetName.Property, 1, [
      { name: '目录', code: 'directoryName', type: '描述型' },
      { name: '属性名称', code: 'name', type: '描述型' },
      { name: '属性代码', code: 'code', type: '描述型' },
      {
        name: '属性类型',
        code: 'valueType',
        type: '选择型',
        options: [
          '数值型',
          '描述型',
          '选择型',
          '分类型',
          '附件型',
          '日期型',
          '时间型',
          '用户型',
        ],
      },
      { name: '单位', code: 'unit', type: '描述型' },
      { name: '枚举字典', code: 'speciesCode', type: '选择型' },
      { name: '属性定义', code: 'remark', type: '描述型' },
      { name: '附加信息', code: 'info', type: '描述型' },
    ]);
    this.directory = directory;
  }
}

export class PropReadConfig extends ReadConfigImpl<
  Property,
  Context,
  PropSheetConfig,
  ExcelConfig<Context>
> {
  constructor(sheetConfig: PropSheetConfig, config: ExcelConfig<Context>) {
    super(sheetConfig, config);
  }
  /**
   * 数据校验
   * @param data 数据
   */
  async checkData?(data: Property[]): Promise<void> {
    let speciesCodeIndex = this.context.speciesCodeIndex;
    let dictCodeIndex = this.context.dictCodeIndex;
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!item.directoryName || !item.name || !item.valueType) {
        this.pushError(index, '存在未填写的目录、属性名称、属性类型！');
      }
      if (item.valueType == '选择型') {
        if (item.speciesCode) {
          if (!speciesCodeIndex[item.speciesCode] && !dictCodeIndex[item.speciesCode]) {
            this.pushError(index, `未获取到字典：${item.speciesCode}！`);
            continue;
          }
          if (speciesCodeIndex[item.speciesCode]) {
            item.speciesId = speciesCodeIndex[item.speciesCode].id;
          }
          if (dictCodeIndex[item.speciesCode]) {
            item.speciesId = dictCodeIndex[item.speciesCode].id;
          }
        } else {
          this.pushError(index, '当属性类型为选择型时，必须填写枚举字典！');
        }
      }
    }
  }
  /**
   * 更新/创建属性
   * @param index 行索引
   * @param row 行数据
   * @param context 上下文
   */
  async operatingItem(row: Property, index: number): Promise<void> {
    let context = this.excelConfig.context;
    let directory = context.directoryIndex[row.directoryName];
    let property = context.propIndex[row.directoryId][row.name];
    let success: boolean = false;
    if (property) {
      success = await property.update({
        ...property.metadata,
        name: row.name,
        code: row.code,
        valueType: row.valueType,
        unit: row.unit,
        directoryId: row.directoryId,
        speciesId: row.valueType == '选择型' ? row.speciesId : undefined!,
        remark: row.remark,
        info: row.info,
      });
    } else {
      let property = await directory.createProperty({
        ...row,
        speciesId: row.valueType == '选择型' ? row.speciesId : undefined!,
      });
      if (property) {
        context.propIndex[row.directoryId][row.name] = property;
        context.propCodeIndex[row.code] = property;
      }
      success = !!property;
    }
    if (!success) {
      this.pushError(index, '生成失败，请根据提示修改错误！');
    }
  }
}
