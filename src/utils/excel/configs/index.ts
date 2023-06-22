import { IDirectory } from '@/ts/core';
import { ExcelConfig, ReadConfig, SheetConfig, SheetName } from '../types';
import { DirectorySheetConfig, DirectoryReadConfig } from './base/directory';
import {
  DictSheetConfig,
  DictReadConfig,
  ClassifyReadConfig,
  ClassifySheetConfig,
} from './species/species';
import {
  DictItemSheetConfig,
  DictItemReadConfig,
  ClassifyItemSheetConfig,
  ClassifyItemReadConfig,
} from './species/speciestem';
import { PropReadConfig, PropSheetConfig } from './store/property';
import {
  FormReadConfig,
  FormSheetConfig,
  WorkReadConfig,
  WorkSheetConfig,
} from './base/form';
import {
  FormAttrReadConfig,
  FormAttrSheetConfig,
  WorkAttrReadConfig,
  WorkAttrSheetConfig,
} from './base/attribute';

export const getConfigs = (directory: IDirectory) => {
  let configs: SheetConfig<any>[] = [
    new DirectorySheetConfig(directory),
    new DictSheetConfig(directory),
    new DictItemSheetConfig(directory),
    new ClassifySheetConfig(directory),
    new ClassifyItemSheetConfig(directory),
    new PropSheetConfig(directory),
    new FormSheetConfig(directory),
    new FormAttrSheetConfig(directory),
    new WorkSheetConfig(directory),
    new WorkAttrSheetConfig(directory),
  ];
  return configs;
};

export const getReadConfigs = (directory: IDirectory, excel: ExcelConfig<any>) => {
  let readConfigs: ReadConfig<any, any, SheetConfig<any>, any>[] = [];
  for (let config of getConfigs(directory)) {
    switch (config.sheetName) {
      case SheetName.Directory:
        readConfigs.push(new DirectoryReadConfig(config as DirectorySheetConfig, excel));
        break;
      case SheetName.Dict:
        readConfigs.push(new DictReadConfig(config as DictSheetConfig, excel));
        break;
      case SheetName.DictItem:
        readConfigs.push(new DictItemReadConfig(config as DictItemSheetConfig, excel));
        break;
      case SheetName.Species:
        readConfigs.push(new ClassifyReadConfig(config as ClassifySheetConfig, excel));
        break;
      case SheetName.SpeciesItem:
        let conf = new ClassifyItemReadConfig(config as ClassifyItemSheetConfig, excel);
        readConfigs.push(conf);
        break;
      case SheetName.Property:
        readConfigs.push(new PropReadConfig(config as PropSheetConfig, excel));
        break;
      case SheetName.Form:
        readConfigs.push(new FormReadConfig(config as FormSheetConfig, excel));
        break;
      case SheetName.FormAttr:
        readConfigs.push(new FormAttrReadConfig(config as FormAttrSheetConfig, excel));
        break;
      case SheetName.Work:
        readConfigs.push(new WorkReadConfig(config as FormSheetConfig, excel));
        break;
      case SheetName.WorkAttr:
        readConfigs.push(new WorkAttrReadConfig(config as WorkAttrSheetConfig, excel));
        break;
    }
  }
  return readConfigs;
};
