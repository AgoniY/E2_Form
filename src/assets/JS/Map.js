/**
 * 初始化Excel标题字段映射
 * TABLE_NAME 血缘表
 * YLZB 血缘字段
 * DATA_LABLE 控件标签
 * CONTROLTYPE 控件类型，默认值为Input
 * Column 每行几列，默认值为2
 * PARTTEN 验证表达式，默认空 
 * */
export const KeyMap = {
    "PK_UUID":"pk_uuid",
    "CPS":"CPS",
    
    "TABLE_NAME":"TableName",
    "YLZB":"YLZB",
    "DATA_LABLE":"DataName",
    "YLDMJ":"YLDMJ",
    "CHAPTER":"BroadHead",
    "CONTROLTYPE":"ControlType",
    "PARTTEN":"Partten",
    "COLUMN":"Column",
    "MAXLENGTH":"MaxLength"
}

/**
 * 初始化标记循环表名!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * */
export const ListViewTableList = ['V_Project_Person_3','V_Project_Person_4','T_CPS_01','V_Project_Unit_2']     //2022自然科学基金
//余姚孵化器 ['V_Project_Person_4','V_Project_Unit_2']

/**
 * Excel字段映射数据源表ID关系表
 * 这里的key值与数据库无关，仅为了对应Excel中的值
 * 附件表T_Project_Attach名称固定不变！
 */
export const Db_Table_Id= {     //市级
    'Main':86,
    'T_Project_Attach':91,
    'T_Project_Base_Info':87,

    'V_Project_Unit_1':92,
    'V_Project_Unit_2':93,
    'V_Project_Person_2':95,
    'V_Project_Person_3':96,
    'V_Project_Person_4':97,
    'T_Project_Total':115,
    'T_Project_Cost_HJ':88,
    'T_Project_Expect':89,
    'T_Project_Cost_MX':127,

    'T_CPS_01':107,
    'T_CPS_02':108,
    'T_CPS_03':125,
    'T_CPS_04':126,
}

/**
 * Excel字段映射依赖代码ID关系表
 * 这里的key值与数据库无关，仅为了对应Excel中的YLDMJ值
 */
 export const Db_YLDM_Id= {     //市级
    'DM_XB':68,
    'DM_XW':53,
    'DM_ZJLX':56,
    'ZWW_TBJ_XL':312,
    'DM_TPY_ZC':313,
    'DM_TPY_DWXZ':314,
    'DM_TPY_FWCY':315,
    'DM_TPY_ZCLX':316,

    'DM_ZCKJ_ZCJB':37,
    'DM_ZXFX':141,
    'DM_XKLY':205,
}
  
/**
 * 排除默认表,不依据Excel数据生成章节配置
 * 一般不做修改
 */
 export const ExcludeTableList = ['T_Project_Attach','T_Project_Total']





/**
 * 各类型控件所需字段
 */

const Input = {
    "CtrlId": "Input", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "Align": null, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "Maxlength": 0, 
    "Format": null, 
    "Partten": null, 
    "ParttMsg": null, 
    "Calculat": null, 
    "Masking": "None", 
    "IsTotal": false, 
    "TotalDsId": 0, 
    "TotalFieldName": null, 
    "DefaultValue": null 
}

const Select = {
    "CtrlId": "Select", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "ShipDsId": 0, 
    "ShipMember": null, 
    "ShipDisplay": null, 
    "DisplayFieldName": null, 
    "ChangeCtrl": null, 
    "DefaultValue": null 
}

const Date = {
    "CtrlId": "Date", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "DefaultValue": null 
}

const CheckBox = { 
    "CtrlId": "CheckBox", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "ShipDsId": 0, 
    "ShipMember": null, 
    "ShipDisplay": null, 
    "DefaultValue": null 
}

const RadioBox = { 
    "CtrlId": "RadioBox", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "ShipDsId": 0, 
    "ShipMember": null, 
    "ShipDisplay": null, 
    "DefaultValue": null 
}

const RichText = { 
    "CtrlId": "RichText", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "Maxlength": 0, 
    "Rows": 0, 
    "DefaultValue": null, 
    "Describe": null 
}

const Uploader = { 
    "CtrlId": "Uploader", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "ReadOnly": false, 
    "IsRequire": false, 
    "DefaultValue": null 
}

const Hidden = { 
    "CtrlId": "Hidden", 
    "DsId": 0, 
    "FieldName": null, 
    "ColTitle": null, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "DefaultValue": null 
}

const Static = { 
    "CtrlId": "Static", 
    "ColTitle": null, 
    "ItemY": 0, 
    "ItemX": 0, 
    "ItemXSpan": 0, 
    "ItemRow": 0, 
    "ListColWidth": 0, 
    "ListColSort": 0, 
    "ListHide": false, 
    "TableShow": false, 
    "RowShow": false, 
    "Align": null, 
    "Format": null, 
    "FontSize": 0, 
    "Bold": false, 
    "DefaultValue": null 
}