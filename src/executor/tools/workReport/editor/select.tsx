import Handsontable from 'handsontable';

// an editor component
export class selectEditor extends Handsontable.editors.BaseEditor {
  select!: HTMLElement;
  _opened: boolean | undefined;
  init() {
    this.select = this.hot.rootDocument.createElement('SELECT');
    this.select.classList.add('htSelectEditor');
    this.select.style.display = 'none';

    // Attach node to DOM, by appending it to the container holding the table
    this.hot.rootElement.appendChild(this.select);
  }

  prepare(
    row: any,
    col: any,
    prop: any,
    td: any,
    originalValue: any,
    cellProperties: any,
  ) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);
    const selectOptions: any = this.cellProperties.selectOptions;
    this.select.innerText = '';

    selectOptions.forEach((item: any) => {
      const optionElement: any = this.hot.rootDocument.createElement('OPTION');
      optionElement.value = item.id;
      optionElement.innerText = item.name;
      this.select.appendChild(optionElement);
    });
  }

  prepareOptions(optionsToPrepare: any) {
    let preparedOptions: any = {};

    if (Array.isArray(optionsToPrepare)) {
      //
    } else if (typeof optionsToPrepare === 'object') {
      preparedOptions = optionsToPrepare;
    }
    console.log(preparedOptions, 'preparedOptions');
    return preparedOptions;
  }
  /**
   * 设置编辑器值
   * @param value 设置的值
   *
   */
  setValue(value: any) {
    this.select.value = value;
  }
  /**
   * 显示编辑器
   * @param event MouseEvent
   *
   */
  open(event: any) {
    const { top, start, width, height } = this.getEditedCellRect();
    const selectStyle = this.select.style;

    this._opened = true;

    selectStyle.height = `${height}px`;
    selectStyle.minWidth = `${width}px`;
    selectStyle.top = `${top}px`;
    selectStyle[this.hot.isRtl() ? 'right' : 'left'] = `${start}px`;
    selectStyle.margin = '0px';
    selectStyle.display = '';
  }

  getEditedCellRect(): { top: any; start: any; width: any; height: any } {
    throw new Error('Method not implemented.');
  }

  /**
   * 关闭编辑器
   * @param event MouseEvent
   *
   */
  close() {
    this._opened = false;
    this.select.style.display = 'none';
  }
  /**
   * 激活编辑器
   *
   */
  focus() {
    this.select.focus();
  }
  /**
   * 获取编辑器的值
   *
   */
  getValue() {
    return this.select.value;
  }
}
