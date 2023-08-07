const defaultCommonSettings = {
    "$id": {
        "title": "ID",
        "description": "字段名称/英文",
        "type": "string",
        "widget": "idInput",
        "require": true,
        "rules": [
            {
                "pattern": "^#/.+$",
                "message": "ID 必填"
            }
        ]
    },
  
    "title": {
        "title": "标题",
        "type": "string",
        "widget": "htmlInput"
    },
    'components':{
        "title": "组件",
        "type": "string",
        "widget": "htmlInput"
    },
    "displayType": {
        "title": "标题展示模式",
        "type": "string",
        "enum": [
            "row",
            "column"
        ],
        "enumNames": [
            "同行",
            "单独一行"
        ],
        "widget": "radio"
    },
    "description": {
        "title": "说明",
        "type": "string"
    },
    "default": {
        "title": "默认值",
        "type": "string"
    },
    "required": {
        "title": "必填",
        "type": "boolean"
    },
    "placeholder": {
        "title": "占位符",
        "type": "string"
    },
    "min": {
        "title": "最小值",
        "type": "number"
    },
    "max": {
        "title": "最大值",
        "type": "number"
    },
    "disabled": {
        "title": "禁用",
        "type": "boolean"
    },
    "readOnly": {
        "title": "只读",
        "type": "boolean"
    },
    "hidden": {
        "title": "隐藏",
        "type": "boolean"
    },
    "width": {
        "title": "元素宽度",
        "type": "string",
        "widget": "percentSlider"
    },
    "labelWidth": {
        "title": "标签宽度",
        "description": "默认值120",
        "type": "number",
        "widget": "slider",
        "max": 400,
        "props": {
            "hideNumber": true
        }
    }
}

const defaultSettings = {
    
}
export {
    defaultCommonSettings,
    
}