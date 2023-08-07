export const data = [
  [
    1,
    2,
    37,
    4,
    5,
    '=IF(Sheet1!A1>10,"TRUE","FALSE")',
    "Cycling Cap",
    "11/10/2020",
    "01-2331942",
    true,
    "172",
    2,
    2
  ],
  [
    1,
    22,
    32,
    4,
    5,
    "Indonesia",
    "Cycling Cap",
    "03/05/2020",
    "88-2768633",
    true,
    "188",
    6,
    2
  ],
  [
    1,
    21,
    31,
    4,
    51,
    "United States",
    "Full-Finger Gloves",
    "27/03/2020",
    "51-6775945",
    true,
    "162",
    1,
    3
  ],
  [
    1,
    24,
    35,
    4,
    52,
    "Philippines",
    "HL Mountain Frame",
    "29/08/2020",
    "44-4028109",
    true,
    "133",
    7,
    1
  ],
  [
    1,
    25,
    33,
    46,
    58,
    "India",
    "Half-Finger Gloves",
    "02/10/2020",
    "08-2758492",
    true,
    "87",
    1,
    3
  ],
  [
    1,
    26,
    34,
    41,
    5,
    "China",
    "HL Road Frame",
    "28/09/2020",
    "84-3557705",
    false,
    "26",
    8,
    1
  ],
  [

  ],
];

export const nestedHeaders = [
  // //第一行
  // [
  //   {
  //     label: "2019年   9月  30日",
  //     colspan: 12
  //   },
  //   {
  //     label: "单位:万元",
  //     colspan: 4
  //   }
  // ],
  // //第二行
  // [
  //   "",
  //   "",
  //   {
  //     label: "保险板块",
  //     colspan: 6
  //   },
  //   {
  //     label: "其中：代理费",
  //     colspan: 4
  //   },
  //   {
  //     label: "其中：经纪费",
  //     colspan: 4
  //   }
  // ],
  // //第三行
  // [
  //   "",
  //   "",
  //   {
  //     label: "本月",
  //     colspan: 3
  //   },
  //   {
  //     label: "本年",
  //     colspan: 3
  //   },
  //   {
  //     label: "本月",
  //     colspan: 2
  //   },
  //   {
  //     label: "本年",
  //     colspan: 2
  //   },
  //   {
  //     label: "本月",
  //     colspan: 2
  //   },
  //   {
  //     label: "本年",
  //     colspan: 2
  //   },
  //   {
  //     label: "本月",
  //     colspan: 2
  //   },
  //   {
  //     label: "本年",
  //     colspan: 2
  //   }
  // ],
  //第四行
  [
    "险类",
    "险种名称",
    "保费",
    "同比增长值",
    "同比增长率",
    "保费",
    "同比增长值",
    "同比增长率",
    "保费",
    "同比增长值",
    "保费",
    "同比增长值",
    "保费",
    "同比增长值",
    "保费",
    "同比增长值"
  ]
]

const colors = ['yellow', 'red', 'orange and another color', 'green',
  'blue', 'gray', 'black', 'white', 'purple', 'lime', 'olive', 'cyan'
];

const ipValidatorRegexp = /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;

export const columns = [
  {
    type: "text",
    className: "htCenter htMiddle"
  },
  {
    type: "text",
    className: "htCenter htMiddle"
  },
  {
    type: "text",
    className: "htCenter htMiddle"
  },
  {
    type: "text",
    className: "htCenter htMiddle"
  },
  {
    type: "text",
    className: "htCenter htMiddle",
    readOnly: true,
  },
  {
    type: "text",
    className: "htCenter htMiddle",
    validator: ipValidatorRegexp,
    allowInvalid: true
  },
  {
    type: "numeric",
    numericFormat: {
      pattern: "0.00"
    }
  },
  {
    type: 'date',
    dateFormat: 'MM/DD/YYYY',
    correctFormat: true,
    defaultDate: '01/01/1900',
    // datePicker additional options
    // (see https://github.com/dbushell/Pikaday#configuration)
    datePickerConfig: {
      // First day of the week (0: Sunday, 1: Monday, etc)
      firstDay: 0,
      showWeekNumber: true,
      licenseKey: 'non-commercial-and-evaluation',
      disableDayFn(date: any) {
        // Disable Sunday and Saturday
        return date.getDay() === 0 || date.getDay() === 6;
      }
    }
  },
  {
    type: "time",
    timeFormat: 'h:mm:ss',
    correctFormat: true
  },
  {
    type: "checkbox",
    checkedTemplate: 'yes',
    uncheckedTemplate: 'no',
  },
  {
    editor: 'select',
    selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
  },
  {
    type: 'dropdown',
    source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
  },
  {
    type: 'autocomplete',
    source: colors,
    strict: false,
    visibleRows: 4
  },
  { data: 'password', type: 'password', hashLength: 10 },
]

export const columnSummary = [
  {
    sourceColumn: 0,
    type: 'sum',
    destinationRow: 6,
    destinationColumn: 0,
    // force this column summary to treat non-numeric values as numeric values
    forceNumeric: true
  },
  {
    sourceColumn: 1,
    type: 'min',
    destinationRow: 6,
    destinationColumn: 1
  },
  {
    sourceColumn: 2,
    type: 'max',
    destinationRow: 6,
    destinationColumn: 2
  },
  {
    sourceColumn: 3,
    type: 'count',
    destinationRow: 6,
    destinationColumn: 3
  },
  {
    sourceColumn: 4,
    type: 'average',
    destinationRow: 6,
    destinationColumn: 4
  }
]

export const SELECTED_CLASS = "selected";
export const ODD_ROW_CLASS = "odd";