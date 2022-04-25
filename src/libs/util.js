import { ElMessage } from 'element-plus'
import FormColumnMap from '@/assets/JSON/FormColumnMap'
import { 
    KeyMap,
} from '@/assets/JS/Map.js'
//import XLSX from 'xlsx'
let XLSX = require('xlsx')
/**
 * @description excel文件读取
 * @param {*} flielist
 * @returns {*} excel_json
 */
export const readExcelContent = function(e,callback) {
    var files = e;
    var fileReader = new FileReader();
    var excel_json = []
    fileReader.onload = function (ev) {
        try {
            var data = ev.target.result
            var workbook = XLSX.read(data, {
                type: 'binary',
                cellDates: true
            }) // 以二进制流方式读取得到整份excel表格对象
            var persons = []; // 存储获取到的数据
        } catch (e) {
            ElMessage({
                message: '文件类型错误',
                grouping: true,
                type: 'error',
              })
            return;
        }
        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        // 遍历每张表读取
        //console.log(workbook.Sheets);
        for (var sheet in workbook.Sheets) {
            //console.log(sheet);
            if(workbook.Sheets.hasOwnProperty(sheet)){
                fromTo = workbook.Sheets[sheet]['!ref'];
                //console.log(workbook.Sheets[sheet]);
                persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                break; // 如果只取第一张表，就取消注释这行
            }
        }
        //在控制台打印出来表格中的数据
        persons.forEach(item=>{
            item[KeyMap.CHAPTER] = removeLineFeed(item[KeyMap.CHAPTER])
            item[KeyMap.DATA_LABLE] = removeLineFeed(item[KeyMap.DATA_LABLE])
        })
        console.log(persons)
        excel_json = persons;
        callback(excel_json)
    };
    // 以二进制方式打开文件
    //console.log(files[0].raw);
    fileReader.readAsBinaryString(files[0].raw)
}


/**
 * @description 获取对应控件所有配置项，Suits = null表示适合所有控件
 */
export const getColAttr = function(colType) {
    let attr = {
        "CtrlId":colType
    }
    for(let i = 1; i<FormColumnMap.length; i++){
        if(!FormColumnMap[i].Suits || FormColumnMap[i].Suits.includes(colType)){
            attr[FormColumnMap[i].PropFld] = FormColumnMap[i].Value
        }
    }
    return attr
}

/**
 * 获取所有空间类型
 */
export const getAllCols = function (){
    return FormColumnMap[0].Options.map(item=>item.Val)
}

/*
* 正则去标签格式化
*/
export const removeLabel = function (val) {
    let texts = val;
    let text1 = texts.replace(/<\/?.+?>/g, "");
    let text2 = text1.replace(/ /g, "");
    return text2;
}

/**
 * 
 * @param {字符串值} val 
 * @returns 正则去掉\r\n后的字符串值
 */
export const removeLineFeed = function(val,reg=[/\n/g,/\r/g]){
    let text = val
    reg.forEach((item)=>{
        text = text.replace(item,"")
    })
    return text
}
console.log(removeLineFeed('信息段1\r信息段2\n信息段3\r\n\r信息段4\n\r\r\n'+'信息段5\r信息段6\n信息段7\r\n\r信息段8\n\r\r\n'))

/**
 * 表单生成JSON格式检查
 * 血缘字段查重
 */
export const checkRepeat = function(E2Json){
    let arr = []                //所有血缘字段
    let noDsIdArr = []          //未设置（匹配到）数据源字段
    let noRepeatArr = []        //去重字段
    let Repeat = {}             //重复字段
    
    E2Json.forEach(chap=>{
        chap.Cols.forEach(col=>{
            arr.push(col)
            if(col.DsId!=0){        
                let flag = noRepeatArr.findIndex(item=>{
                    return item.DsId == col.DsId&&item.FieldName == col.FieldName
                })  
                if(flag!=-1){       //存在重复字段
                    if(Repeat.hasOwnProperty(col.FieldName+col.DsId)){
                        Repeat[col.FieldName+col.DsId].RepeatNum++
                    }else{
                        Repeat[col.FieldName+col.DsId] = {
                            RepeatNum:1,
                            RepeatCol:col
                        }
                    }
                }else{
                    noRepeatArr.push(col)
                }
            }else{
                noDsIdArr.push(col)
            }
        })
    })

    //console.log(Repeat)
    return {noDsIdArr,Repeat}
}


