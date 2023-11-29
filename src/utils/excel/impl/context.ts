import * as t from '../type';

export class DirContext implements t.Context {
  directories: { [key: string]: t.DirData };
  species: { [key: string]: t.SpeciesData };
  properties: { [key: string]: t.Property };

  constructor() {
    this.directories = {};
    this.species = {};
    this.properties = {};
  }

  async initialize(
    directory: t.IDirectory,
    onProgress: (progress: number) => void,
  ): Promise<void> {
    const counting = (dir: t.IDirectory) => {
      let count = 1;
      for (let child of dir.children) {
        count += counting(child);
      }
      return count;
    };
    let completed = 0;
    let total = counting(directory);
    await this.recursion(
      directory,
      () => {
        const fixedProgress = ((++completed * 100) / total).toFixed(2);
        onProgress(Number(fixedProgress));
      },
      true,
    );
    onProgress(100);
  }

  private async recursion(
    parent: t.IDirectory,
    onItemCompleted: () => void,
    isRoot: boolean,
  ): Promise<void> {
    for (const dir of parent.children) {
      await dir.standard.loadStandardFiles();
      const dirData: t.DirData = {
        meta: { ...dir.metadata, directoryCode: isRoot ? undefined : parent.code },
        forms: {},
      };
      for (const species of dir.standard.specieses) {
        const speciesData: t.SpeciesData = {
          meta: { ...species.metadata, directoryCode: dir.code },
          items: {},
        };
        for (const item of await species.loadItems()) {
          if (item.info) {
            speciesData.items[item.info] = {
              ...item,
              speciesCode: species.code,
              parentInfo: item.parent?.info,
            };
          }
        }
        this.species[species.code] = speciesData;
      }
      for (const property of dir.standard.propertys) {
        if (property.metadata.code) {
          this.properties[property.metadata.code] = {
            ...property.metadata,
            directoryCode: dir.code,
          };
        }
      }
      for (const form of dir.standard.forms) {
        const formData: t.FormData = {
          meta: { ...form.metadata, directoryCode: dir.code },
          attrs: {},
        };
        await form.loadContent();
        for (const attr of form.attributes) {
          formData.attrs[attr.code] = {
            ...attr,
            propCode: attr.property!.info,
            formCode: form.code,
          };
        }
        dirData.forms[form.code] = formData;
      }
      this.directories[dirData.meta.code] = dirData;
      onItemCompleted();
      await this.recursion(dir, onItemCompleted, false);
    }
  }
}
