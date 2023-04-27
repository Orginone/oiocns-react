export namespace common {
  interface OperationType {
    key: string;
    label: any;
    onClick: () => void;
  }

  interface OptionType {
    value: string;
    label: any;
    onClick?: () => void;
  }
}

interface ICommonParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}
