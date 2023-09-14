import { IDirectory } from '@/ts/core';
import { ISheetRead, ISheet, SheetName } from '../types';
import { AttrSheetRead, AttrSheet } from './base/attribute';
import { DirectorySheetRead, DirectorySheet } from './base/directory';
import { FormSheetRead, FormSheet } from './base/form';
import { ClassifySheetRead, ClassifySheet, DictSheetRead, DictSheet } from './species/species';
import {
  ClassifyItemSheetRead,
  ClassifyItemSheet,
  DictItemSheetRead,
  DictItemSheet,
} from './species/speciesitem';
import { PropSheetRead, PropSheet } from './store/property';

export const getConfigs = (directory: IDirectory) => {
  let sheets: ISheet<any>[] = [
    new DirectorySheet(directory),
    new DictSheet(directory),
    new DictItemSheet(directory),
    new ClassifySheet(directory),
    new ClassifyItemSheet(directory),
    new PropSheet(directory),
    new FormSheet(directory),
    new AttrSheet(directory),
  ];
  return sheets;
};

export const getReadConfigs = (directory: IDirectory) => {
  let readSheets: ISheetRead<any, any, ISheet<any>>[] = [];
  for (let config of getConfigs(directory)) {
    switch (config.sheetName) {
      case SheetName.Directory:
        readSheets.push(new DirectorySheetRead(config as DirectorySheet));
        break;
      case SheetName.Dict:
        readSheets.push(new DictSheetRead(config as DictSheet));
        break;
      case SheetName.DictItem:
        readSheets.push(new DictItemSheetRead(config as DictItemSheet));
        break;
      case SheetName.Species:
        readSheets.push(new ClassifySheetRead(config as ClassifySheet));
        break;
      case SheetName.SpeciesItem:
        readSheets.push(new ClassifyItemSheetRead(config as ClassifyItemSheet));
        break;
      case SheetName.Property:
        readSheets.push(new PropSheetRead(config as PropSheet));
        break;
      case SheetName.Form:
        readSheets.push(new FormSheetRead(config as FormSheet));
        break;
      case SheetName.FormAttr:
        readSheets.push(new AttrSheetRead(config as AttrSheet));
        break;
    }
  }
  return readSheets;
};
