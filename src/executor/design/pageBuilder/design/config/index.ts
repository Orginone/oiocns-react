import { IExistTypeEditor } from './IExistTypeEditor';
import CssSizeEditor from './CssSizeEditor';
import { Form, Picture, Work } from './FileProp';
import SlotProp from './SlotProp';

const editors: Dictionary<IExistTypeEditor<any, any>> = {
  picFile: Picture,
  workFile: Work,
  formFile: Form,
  size: CssSizeEditor,
  slot: SlotProp,
};

export default editors;
