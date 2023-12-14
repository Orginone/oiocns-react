import Handsontable from 'handsontable';

class dateEditors extends Handsontable.editors.BaseEditor {
  select: HTMLElement | any = null;
  /**
   * Initializes editor instance, DOM Element and mount hooks.
   */
  init() {
    // Create detached node, add CSS class and make sure its not visible
    this.select = this.hot.rootDocument.createElement('INPUT');
    this.select.classList.add('htSelectEditor');
    this.select.style.display = 'none';
    this.select.value = '99999';

    console.log(this.select, '3333');

    // Attach node to DOM, by appending it to the container holding the table
    this.hot.rootElement.appendChild(this.select);
  }

  prepare(
    row: number,
    col: number,
    prop: string | number,
    td: HTMLTableCellElement,
    originalValue: any,
    cellProperties: Handsontable.CellProperties,
  ) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);
    console.log(row, col, prop, td, originalValue, cellProperties);
    // empty(this.select);
  }
  close(): void {
    this.select.style.display = 'none';
  }
  focus(): void {
    throw new Error('Method not implemented.');
  }
  getValue() {
    throw new Error('Method not implemented.');
  }
  open() {
    this.select.style.display = 'block';
    console.log('2');
  }
  setValue(newValue?: any) {
    console.log('1');
    console.log(this.select, '123111');
    this.select.value = newValue;
    throw new Error('Method not implemented.');
  }
}

export default dateEditors;
