# e2_form
注意事项：
1、目前代码中用到的Excel标题字段：
TableName、YLZB、DataName、Column、BroadHead、Partten、ControlType。
其中必填字段（不能空）：TableName、YLZB、DataName、BroadHead
非必填字段（系统设定默认值）：Column、Partten、ControlType

2、目前支持控件：Input、Select、Hidden、Date、Uploader、RichText、Radiobox、Checkbox
3、依赖代码集还未完善，需在表单配置工具中手动添加
4、Select、Radiobox、Checkbox的数据源还无法智能填充
5、表格total合计值字段暂时无法智能判断
6、{V_Project_Person_2  项目负责人   V_Project_Person_3  核心或主要成员人员表} 作为树表需要添加@RY_MAIN_SIGN字段，可以参考：市级软科学研究项目（一般项目）

问题清单：
1、树表的Hidden字段PK_UUID是否要区分大小写?
√ 2、章节SeqNo必须从1开始，否则报错

改进方案：
√ 1、SeqNo从1开始
√ 2、正则匹配删除\r\n

优化方案：
√ 添加TextArea控件，删除richText控件 
添加static控件
*列出所有已匹配的表名称和未匹配的表名称
*列出所有存在字符串值被污染的条目（比如\r\n）
数据源自动配置功能


0421问题:
为什么正则匹配删除\r\n导致字段缺失

## Element Plus set 
变更目录为：element-plus/theme-chalk/index.css


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


