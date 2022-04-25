//import KeyMap from '@/assets/JSON/KeyMap'
import { 
    KeyMap,
    ListViewTableList,
    ExcludeTableList,
    Db_Table_Id,
    Db_YLDM_Id
} from '@/assets/JS/Map.js'
import { getColAttr,getAllCols,removeLineFeed} from '@/libs/util.js'
import { updateTemplateContent } from '@/api/home'

const reg = [/\n/g,/\r/g]         //正则初始化章节标题、控件Label规则（这里是第二层处理，第一层在解析Excel时候处理）
const SEQNO_ITV = 10        //章节的间隔数 
const COLS_ITV = 10         //控件行间隔数
const MAX_SPAN = 12         //每行控件最多可分配空间
var _Span = { CurrSpan:0, IsLineFeed:false }  //全局行状态，CurrSpan当前行已使用空间,IsLineFeed是否需要执行换行
const DefultColumnSpan = {RichText:12,TextArea:12}  //配置不同类型控件默认占用的行空间

/*
* 将excel读取的表单配置项格式化,以章节名称（BroadHead）来划分
* @param  {array} excel_data
* @return {array} format_data {Chapter:['Chapter title'],Belong:[1|2|3],Children:[]}
*/
export function formatE2JsonByChapter(arr){
    let map = {}, dest = {}, SeqNo = 1, ColNo = 0, currViewMode = 2     
    dest.ListView = ListViewTableList   //循环表名称
    dest.Chaps = []
    /**添加章节配置 */
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if(ExcludeTableList.includes(item[KeyMap.TABLE_NAME])) break
        if (!map[removeLineFeed(item[KeyMap.CHAPTER],reg)]) {       //生成新的章节
            map[removeLineFeed(item[KeyMap.CHAPTER],reg)] = removeLineFeed(item[KeyMap.CHAPTER],reg);           //正则去\r\n
            let Chap = formatChapter({
                SeqNo: SeqNo,
                HasAdd:true,
                item: item
            })

            currViewMode = Chap.ViewMode        //供Col判断，章节类型只有2 || 1
            ColNo = 0
            resetSpan()

            if(currViewMode==2){
                Chap.Cols = [...initListViewCols(item[KeyMap.TABLE_NAME])]
            }
            Chap.Cols.push(formatCol({
                item:item,
                ColNo:ColNo,
                XSpan:getCurrColColumn(item),
                ViewMode:currViewMode
            }))
            dest.Chaps.push(Chap);
            SeqNo += SEQNO_ITV
        } else {
            let _XSpan = getCurrColColumn(item)      //这里必须先执行，判断当前是否需要换行
            if(_Span.IsLineFeed) { ColNo += COLS_ITV }

            for (let j = dest.Chaps.length-1; j >=0; j--) {     
                let Chapter = dest.Chaps[j];
                if (Chapter.ChapterName == removeLineFeed(item[KeyMap.CHAPTER],reg)) {
                    //Chapter.Cols.push(item);
                    if(j==dest.Chaps.length-1){     
                        Chapter.Cols.push(formatCol({
                            item:item,
                            ColNo:ColNo,
                            XSpan:_XSpan,
                            ViewMode:currViewMode
                        }))
                    }else{
                        Chapter.Cols.push(formatCol({
                            item:item,
                            ColNo:getSpanByChap(Chapter,_XSpan),
                            XSpan:_XSpan,
                            ViewMode:currViewMode
                        }))
                    }
                }
            }
        }
    }
    /**添加默认表单Hidden字段配置 */
    getDefaultHiddenCols().forEach(item=>{
        dest.Chaps[0].Cols.push(item)
    })
    /**添加附件章节配置 */
    dest.Chaps.push(formatAttachFileChapter({
        SeqNo: SeqNo
    }));
    dest.Chaps[dest.Chaps.length-1].Cols = [...initAttchCols()]
    console.log(dest);
    return dest;
}

/*
* 配置章节参数
* @param  {opt} {SeqNo:'章节序号 必传！',item:'条目',HasAdd:'是否新增'}
* @return {object} Chapter(章节信息) {Chapter:['Chapter title'],Belong:[1|2|3],Children:[]}
* if HasAdd equal false,HideDel = true
*/
function formatChapter(opt){
    let _opt = {    //常用默认配置
        SeqNo:0,
        ViewMode:1,
        HasAdd:true,
        ShowHead:true,
        ShowBorder:true,
        Stripe:true,
        HideCz:false,
        NoPrint:false,
        item:{
            [KeyMap.CHAPTER]:''     //item所属章节名称
        }
    }
    let option = Object.assign(_opt, opt)   
    option.ViewMode = judgeChapterType(option.item)     //判断章节展现方式

    let Chapter = {
        "SeqNo": option.SeqNo,
        "ViewMode": option.ViewMode,
        "ChapterName": removeLineFeed(option.item[KeyMap.CHAPTER],reg),
        "HasAnchor": true,
        "HideChapterName": false,
        "MaxHeight": option.ViewMode==2?300:0,
        "TableName": null,
        "HasAdd": option.HasAdd,
        "DialogWidth": option.ViewMode==2?800:0,
        "ItemShowType": false,
        "ShowHead": option.ShowHead,
        "ShowBorder": option.ShowBorder,
        "ShowXh": true,
        "Stripe": option.Stripe,
        "HideCz": option.HideCz,
        "HideDel": (option.ViewMode==2&&option.HasAdd==false)?true:false,
        "NoEmpty": option.ViewMode==2?true:false,
        "NoPrint": option.NoPrint, 
        "Html": null,
        "Footer": null,
        "ListSort": false,
        "ErrorMsg": null,
        "Cols":[]
    }
    return Chapter
}

/*
* 配置每个控件参数
* @param  {opt} {ColNo:'行号',item:'条目'}
* @return {object} Col(控件信息) 
*/

function formatCol(opt){
    /* let _opt = {    //常用默认配置
        ColNo:0,
        CtrlId:"Input",
    } */
    let _opt = {}
    try{
        _opt = eval(judgeColType(opt.item))(opt)
    }catch(e){      //如果col配置函数未定义，返回空对象
        _opt = {}
    }

    let col = {
        "DsId": null,
        "CtrlId": 'Input',
        "FieldName": null,
        "ColTitle": null,
        "ItemY": 0,
        "ItemX": 0,
        "ItemXSpan": 6,
        "ItemRow": 0,
        "ListColWidth": 0,
        "ListColSort": 0,
        "ListHide": false,
        "TableShow": false,
        "RowShow": false,
        "Value": null,
        "Opxs": null,
        "Align": 0,
        "ReadOnly": false,
        "IsRequire": true,
        "Maxlength": 0,
        "Decimals": 0,
        "Rows": 0,
        "leaf": 0,
        "Format": null,
        "FontSize": 0,
        "Bold": false,
        "Partten": null,
        "ParttMsg": null,
        "Calculat": null,
        "Masking": "None",
        "ShipDsId": 0,
        "ShipMember": null,
        "ShipDisplay": null,
        "DisplayFieldName": null,
        "ChangeCtrl": null,
        "DisplayValue": null,
        "ErrorMsg": null,
        "IsTotal": false,
        "TotalDsId": 0,
        "TotalFieldName": null,
        "TotalValue": null,
        "DefaultValue": null,
        "Describe": null
    }
    let option = Object.assign(col, _opt)  
    return option
}

function getInputOpt(opt){
    let option = getColAttr('Input')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB]
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)

    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.Align = 0
    option.IsRequire = !option.ColTitle.includes('备注')        //备注字段非必填
    option.Partten = getColPartten(opt.item)
    option.Masking = "None"

    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.TableShow = true
        option.IsTotal = false
        option.TotalDsId = 0
        option.TotalFieldName = null
    }
    return option
}

function getSelectOpt(opt){
    let option = getColAttr('Select')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB] 
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)
    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.IsRequire = true

    option.ShipDsId = Db_YLDM_Id[opt.item[KeyMap.YLDMJ]]||0
    option.ShipMember = 'codeid'
    option.ShipDisplay = 'codename'
    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.TableShow = true
        option.RowShow = opt.RowShow||false
    }
    return option
}

function getCheckBoxOpt(opt){
    let option = getColAttr('CheckBox')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB] 
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)
    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.IsRequire = true

    option.ShipDsId = Db_YLDM_Id[opt.item[KeyMap.YLDMJ]]||0
    option.ShipMember = 'codeid'
    option.ShipDisplay = 'codename'
    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.TableShow = true
        option.RowShow = opt.RowShow||false
    }
    return option
}

function getRadioBoxOpt(opt){
    let option = getColAttr('RadioBox')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB] 
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)
    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.IsRequire = true

    option.ShipDsId = Db_YLDM_Id[opt.item[KeyMap.YLDMJ]]||0
    option.ShipMember = 'codeid'
    option.ShipDisplay = 'codename'
    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.TableShow = true
        option.RowShow = opt.RowShow||false
    }
    return option
}

function getDateOpt(opt){
    let option = getColAttr('Date')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB] 
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)
    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.IsRequire = true
    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.TableShow = true
        option.RowShow = opt.RowShow||false
    }
    return option
}

function getRichTextOpt(opt){
    let option = getColAttr('RichText')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB] 
    option.ColTitle = "  "
    option.Describe = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)

    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.IsRequire = !option.ColTitle.includes('备注')        //备注字段非必填
    option.Maxlength = getColMaxLength(opt.item)
    option.Rows = getColRow(option.Maxlength)
    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.ListHide = false
        option.TableShow = false
        option.RowShow = opt.RowShow||false
    }
    return option
}

function getTextAreaOpt(opt){
    let option = getColAttr('TextArea')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB] 
    option.ColTitle = "  "
    option.Describe = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)

    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan     //XSpan表示一行中占几列
    option.IsRequire = !option.ColTitle.includes('备注')        //备注字段非必填
    option.Maxlength = getColMaxLength(opt.item)
    option.Rows = getColRow(option.Maxlength)
    if(ViewMode==1){

    }
    if(ViewMode==2){
        option.ListHide = false
        option.TableShow = false
        option.RowShow = opt.RowShow||false
    }
    return option
}

function getHiddenOpt(opt){
    let option = getColAttr('Hidden')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB]
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)
    if(ViewMode==1){}
    if(ViewMode==2){}
    return option
}

function getUploaderOpt(opt){
    let option = getColAttr('Uploader')
    let ViewMode = opt.ViewMode
    option.DsId = Db_Table_Id[opt.item[KeyMap.TABLE_NAME]]||0
    option.FieldName = opt.item[KeyMap.YLZB]
    option.ColTitle = removeLineFeed(opt.item[KeyMap.DATA_LABLE],reg)

    option.ItemY = opt.ColNo
    option.ItemXSpan = opt.XSpan
    option.IsRequire = opt.IsRequire||false     //不传默认不必填
    if(ViewMode==1){
        
    }
    if(ViewMode==2){
        option.TableShow = true
        option.RowShow = opt.RowShow||false
    }
    return option
}

/*
* 添加附件章节配置（固定）
*/
function formatAttachFileChapter(opt){
    opt.item = {[KeyMap.CHAPTER]:'附件'}
    opt.HasAdd = false
    opt.ShowHead = false
    opt.ShowBorder = false
    opt.Stripe = false
    opt.HideCz = true
    opt.NoPrint = true

    let attach = formatChapter(opt)
    return attach
}

/*
* 判断属于什么类型章节
* 不传默认为1。 1:ItemView  2:ListView  3:ListItem
*/
function judgeChapterType(item){
    if(item[KeyMap.TABLE_NAME]){
        return ListViewTableList.includes(item[KeyMap.TABLE_NAME]) ? 2:1
    }else{
        return 2        /**用于附件配置 */
    }
}

/*
* 判断属于什么类型控件
* 没有ControlType或不属于现有控件类型的，默认Input类型
*/
function judgeColType(item){
    return item[KeyMap.CONTROLTYPE]&&getAllCols().includes(item[KeyMap.CONTROLTYPE])?"get"+item[KeyMap.CONTROLTYPE]+"Opt":"getInputOpt";
}

/**
 * 获取当前控件所占列空间，一行12，空值默认为6优先级低
 * RichText 默认为12优先级高
 * @param {*} item 
 * @returns 
 */
function getCurrColColumn(item){
    let column = item[KeyMap.COLUMN]?item[KeyMap.COLUMN]:6
    if(DefultColumnSpan[item[KeyMap.CONTROLTYPE]]){column = DefultColumnSpan[item[KeyMap.CONTROLTYPE]]}
    getSpan(column) 
    return column
}

/*
* 判断当前每行剩余空间and是否需换行
*/
function getSpan(colSpan){
    if(_Span.CurrSpan + colSpan <= MAX_SPAN){
        _Span.CurrSpan += colSpan
        _Span.IsLineFeed = false
    }else{
        _Span.CurrSpan = colSpan
        _Span.IsLineFeed = true
    }
}

/*
* 根据当前所属章节是否需换行
*/
function getSpanByChap(Chap,XSpan){
    let cols = Chap.Cols
    let ColNo = cols[cols.length-1].ItemY
    let XSpanSum = cols.filter(itme=>itme.ItemY == ColNo)
    .reduce((sum,i)=>{return sum + i.ItemXSpan},0) + XSpan
    if(XSpanSum>12){ColNo+=COLS_ITV}
    return ColNo
}

/*
* 重置全局行状态
*/
function resetSpan(){
    _Span.CurrSpan = 0
    _Span.IsLineFeed = false
}

/**
 * ListView类型章节初始化添加Table主键和序号字段
 * @param { t_N:血缘表名称 } 
 * @returns 
 */
function initListViewCols(t_N){
    let YLZB_MAIN_KEY = 'PK_UUID'
    if(t_N == 'T_Project_Attach') YLZB_MAIN_KEY = 'Id'
    let arr = [     //模拟数据
        {
            ViewMode:2,
            item:{
                [KeyMap.DATA_LABLE]:'主键',
                [KeyMap.TABLE_NAME]:t_N,
                [KeyMap.YLZB]:YLZB_MAIN_KEY        //是否要区分大小写？ pk_uuid
            }
        },
        {
            ViewMode:2,
            item:{
                [KeyMap.DATA_LABLE]:'序号',
                [KeyMap.TABLE_NAME]:t_N,
                [KeyMap.YLZB]:'Sort',
            }
        }
    ]
    return arr.map(item => getHiddenOpt(item))
}

/*
* 添加附件表字段配置（固定）
*/
function initAttchCols(){
    let t_N = 'T_Project_Attach'
    let arr = [     //模拟数据
        {
            ViewMode:2,
            ColNo:0,
            XSpan:12,
            item:{
                [KeyMap.DATA_LABLE]:'附件名称',
                [KeyMap.TABLE_NAME]:t_N,
                [KeyMap.YLZB]:'Title',
            }
        },
        {
            ViewMode:2,
            ColNo:0,
            XSpan:12,
            RowShow:true,
            item:{
                [KeyMap.DATA_LABLE]:'上传',
                [KeyMap.TABLE_NAME]:t_N,
                [KeyMap.YLZB]:'Files',
            }
        },
        {
            ViewMode:2,
            item:{
                [KeyMap.DATA_LABLE]:'必填',
                [KeyMap.TABLE_NAME]:t_N,
                [KeyMap.YLZB]:'Request',
            }
        }
    ]
    return [...initListViewCols(t_N),getInputOpt(arr[0]),getUploaderOpt(arr[1]),getHiddenOpt(arr[2])]
}

/**
 * 添加表单默认Hidden字段
 */
function getDefaultHiddenCols(){
    //要对应到Map.js中的字段名
    let Main_table = 'Main',
        Base_info_table = 'T_Project_Base_Info',
        Project_Unit_table='V_Project_Unit_1'
    let arr = [
        {
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'计划类别代码',
                [KeyMap.TABLE_NAME]:Main_table,
                [KeyMap.YLZB]:'JHLB_DM',
            }
        },
        {
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'计划类别名称',
                [KeyMap.TABLE_NAME]:Main_table,
                [KeyMap.YLZB]:'JHLB_MC',
            }
        },{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'申报单位代码',
                [KeyMap.TABLE_NAME]:Main_table,
                [KeyMap.YLZB]:'SBDW_DM',
            }
        },{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'申报单位名称',
                [KeyMap.TABLE_NAME]:Main_table,
                [KeyMap.YLZB]:'SBDW_MC',
            }
        },{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'归口部门代码',
                [KeyMap.TABLE_NAME]:Base_info_table,
                [KeyMap.YLZB]:'XM_GSZX_DM',
            }
        },/*{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'归口部门名称',
                [KeyMap.TABLE_NAME]:Base_info_table,
                [KeyMap.YLZB]:'XM_GSZX_MC',
            }
        },*/{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'main表创建人id',
                [KeyMap.TABLE_NAME]:Main_table,
                [KeyMap.YLZB]:'CreateUserId',
            }
        },{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'main表创建人名称',
                [KeyMap.TABLE_NAME]:Main_table,
                [KeyMap.YLZB]:'CreateName',
            }
        },{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'info表创建人id',
                [KeyMap.TABLE_NAME]:Base_info_table,
                [KeyMap.YLZB]:'CreateUserId',
            }
        },{
            ViewMode:1,
            item:{
                [KeyMap.DATA_LABLE]:'单位主键',
                [KeyMap.TABLE_NAME]:Project_Unit_table,
                [KeyMap.YLZB]:'PK_UUID',
            }
        }
    ]
    return arr.map(item=>{
        return getHiddenOpt(item)
    })
}

/*
* 获取验证表达式
* 没有则默认null
*/
function getColPartten(item){
    return item[KeyMap.PARTTEN]?item[KeyMap.PARTTEN]:null;
}

/*
* 获取最大字数限制值
* 没有则默认0
*/
function getColMaxLength(item){
    return item[KeyMap.MAXLENGTH]?item[KeyMap.MAXLENGTH]:0;
}


/*
* 根据最大字数限制获取RichText行数
* 最多8行
*/
function getColRow(length){
    let row = 8
    if(length<=200){
        row = 4
    }else if(length<=300){
        row = 4
    }else if(length<=500){
        row = 4
    }else if(length<=800){
        row = 6
    }
    return row
}
