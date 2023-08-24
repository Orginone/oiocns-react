import React, { useRef } from 'react';
import { BaseEditorComponent  } from '@handsontable/react';

export class EditorComponent extends BaseEditorComponent<{}, {value?: any}> {
  mainElementRef: any;
  containerStyle: any;

  constructor(props: any) {
    super(props);

    this.mainElementRef = React.createRef();

    this.state = {
      value: ''
    };

    this.containerStyle = {
      display: 'none'
    };
  }

  getValue() {
    return this.state.value;
  }

  setValue(value: any, callback: any) {
    this.setState((state, props) => {
      return {value: value};
    }, callback);
  }

  setNewValue() {
    this.setValue('new-value', () => {
      this.finishEditing();
    })
  }

  open() {
    this.mainElementRef.current.style.display = 'block';
  }

  close() {
    this.mainElementRef.current.style.display = 'none';
  }

  render(): React.ReactElement<string> {
    return (
      <div style={this.containerStyle} ref={this.mainElementRef} id="editorComponentContainer">
        <button onClick={this.setNewValue.bind(this)}></button>
      </div>
    );
  }
}