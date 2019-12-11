MultiFunctionalList说明文档
=======
1，cardOption
-------
该参数控制列表每一行卡片的显示内容

你的参数应该像这样
```
{
      sign: {
        field: 'status',
        src: [
          {
            key: '1',
            value: '可用',
            color: SIGN_COLOR['3'],
          }, {
            key: '0',
            value: '不可用',
            color: SIGN_COLOR['4'],
          },
        ],
      },
      detail: [
        { field: 'departmentId',icon:<Icon type="team" />,src: this.convertData(departmentData, 'id', 'departmentName'), editable: true },
               { field: 'roleId', src: this.convertData(roleData, 'id', 'name'), editable: true ,icon:<Icon type="key" />},
               { field: 'nickname', title: '昵称' ,icon:<Icon type="user" />},
      ],
      defaultClick: this.touche,
      otherEvent: {
        onDoubleClick: this.touche,
      },
}
```
sign只是一个特殊的detail字段，用于展示可以代表状态的重要字段（object）

field:字段（string）

title:显示的label名称（string）

src:下拉的数据字典，需要转换成标准的{key：value}（array）

editable:是否展示下拉（boolean）

icon：图标项（reactElement）

defaultClick（function）：点击A标签触发的事件，回调返回点击条目的data

otherEvent（object）：可以绑定事件在每一行卡片上，回调返回触发条目的data

2，dataSource
-------------
（array）：该参数为从后台list接口获取的data数组，包含全部信息

3，loadingList
-----------
（loading）：列表的loading值

4，loadingUpdate
----------
（loading）：编辑保存的loading值

5，updateFunction
--------
编辑时调用的函数（function）：该函数会自动返回回调参数,data为当前编辑项的信息
```
function（data）{

   }
```
6，pagination={pageProps}
----------
分页信息（object），你的参数应该像这样
```
pageProps = {
      turnPage: this.listPage,
      total : 0,
      currentPage : 1,
      pageSize : 10,
    };
```
turnPage（function）: 翻页调用的函数，该函数会自动返回回调参数,params为分页时的分页信息
```
function (params){
  };
```
7，btnOptions={btnList}
--------
参考toolbar配置信息

8，ck
--------
（boolean）：传入该参数开启左侧checkbox选项

9,checks
-------
(array): 传入一个数组数组，每一项是一个object包含以下参数，初始化时可以传空数组
status：勾选的状态
index：每一项的索引


10,onSelectChange={this.onSelectChange}
-------
（function）：配合ck使用，选中某一行或全选的回调，data为数组，所有选中项的信息
```
 onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };
```



