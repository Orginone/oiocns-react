import { IDirectory } from '@/ts/core';
import { ReadConfig, SheetConfig, SheetName } from '../types';
import { AttrReadConfig, AttrSheetConfig } from './base/attribute';
import { DirectoryReadConfig, DirectorySheetConfig } from './base/directory';
import { FormReadConfig, FormSheetConfig } from './base/form';
import {
  ClassifyReadConfig,
  ClassifySheetConfig,
  DictReadConfig,
  DictSheetConfig,
} from './species/species';
import {
  ClassifyItemReadConfig,
  ClassifyItemSheetConfig,
  DictItemReadConfig,
  DictItemSheetConfig,
} from './species/speciesitem';
import { PropReadConfig, PropSheetConfig } from './store/property';

export const getConfigs = (directory: IDirectory) => {
  let configs: SheetConfig<any>[] = [
    new DirectorySheetConfig(directory),
    new DictSheetConfig(directory),
    new DictItemSheetConfig(directory),
    new ClassifySheetConfig(directory),
    new ClassifyItemSheetConfig(directory),
    new PropSheetConfig(directory),
    new FormSheetConfig(directory),
    new AttrSheetConfig(directory),
  ];
  return configs;
};

export const getReadConfigs = (directory: IDirectory) => {
  let readConfigs: ReadConfig<any, any, SheetConfig<any>>[] = [];
  for (let config of getConfigs(directory)) {
    switch (config.sheetName) {
      case SheetName.Directory:
        readConfigs.push(new DirectoryReadConfig(config as DirectorySheetConfig));
        break;
      case SheetName.Dict:
        readConfigs.push(new DictReadConfig(config as DictSheetConfig));
        break;
      case SheetName.DictItem:
        readConfigs.push(new DictItemReadConfig(config as DictItemSheetConfig));
        break;
      case SheetName.Species:
        readConfigs.push(new ClassifyReadConfig(config as ClassifySheetConfig));
        break;
      case SheetName.SpeciesItem:
        readConfigs.push(new ClassifyItemReadConfig(config as ClassifyItemSheetConfig));
        break;
      case SheetName.Property:
        readConfigs.push(new PropReadConfig(config as PropSheetConfig));
        break;
      case SheetName.Form:
        readConfigs.push(new FormReadConfig(config as FormSheetConfig));
        break;
      case SheetName.FormAttr:
        readConfigs.push(new AttrReadConfig(config as AttrSheetConfig));
        break;
    }
  }
  return readConfigs;
};
