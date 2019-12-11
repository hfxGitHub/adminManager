组件说明
=======
本组件结合StandardTable表格，自动生成搜索界面，具体的生成效果如下图所示
![Alt text](./example.png)


输入参数
========
| 参数名称 | 是否必须 | 类型 | 说明 |
| ------ | ------ | ------ | ------ |
| searchList | 必须 | array | 搜索框中显示的搜索项 |
| doSearch | 必须 | function | 具体执行搜索的函数 |
| pagination |必须 | object | 表格分页信息 |
| col |可选 | number | 表示每一行显示多少个搜索项 |
| renderComponent |可选 | function | 如果是特殊的搜索框，则使用此方法来设定 |

其中：
1. searchList 为自动构建的搜索项
   其结构为:
   ````
   const searchList = [
         {
           title: '商品名称',  //必填参数，标签显示内容
           field: 'goodsName',  //必填参数，查询时的字段名称
           required: true,  //可选参数，是否必须要填写
           message: '必填(测试)',  //可选参数,如果出错的提示信息
           type: 'input',//支持input、datePicker、inputNumber、advancedSelect等类型
                                          reg:  //可选参数，表单项验证规则
         },
         {
           title: '损耗率',
           field: 'lossRate',
           message: '损耗率输入错误',
           type: 'inputNumber',
         },
       ];
   ````
2. 其中 pagination的结构为
````
pagination = {
                   current : pageNumber,//当前页
                   pageSize : pageSize,//每页条目数
                   total : total,//总条目数
                 };     
````                      
3. renderComponent 设定方法为
````
{
        title: '商品类型',
        field: 'goodsTypeId',
        message: '损耗率输入错误',
        type: 'other',
        renderComponent:()=> {
          return (<AdvancedSelect dataSource={goodsTypeData} type='GOODSTYPE' onChange={(value)=>{}} />);
        },
      },
```` 
设定type 为other,  其他部分为自定义。                                

完整的参考范例
=========
配置参数
````
const searchList = [
      {
        title: '商品名称',
        field: 'goodsName',
        required: true,
        message: '必填(测试)',
        type: 'input',
      },
      {
        title: '损耗率',
        field: 'lossRate',
        message: '损耗率输入错误',
        type: 'inputNumber',
      },
    ];
   ///查询函数
     listPage = (params) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'goodsModal/fetch',
          payload: params || {
            currentPage: 1,
            pageSize: 10,
          },
        });
      };
````
在render函数中调用
````
<AdvancedSearchForm
          searchList={searchList}
          doSearch={this.listPage}
          pagination={pagination}
        />
````
