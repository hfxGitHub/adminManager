1，drawerTitle:
--------
抽屉标题（string），不传入该参数，不打开抽屉

2，drawerContent: <UserDetail />,
------------
抽屉展示内容（ReactElement），你应该尽量嵌入你自己写的页面，（不传入参数，会自动帮你生成不完美的drawer）

3，drawerVisible
------------
抽屉的显示属性（boolean）

4，onChangeDrawerVisible
-------
（function）：抽屉开关时的回调函数，该函数包含回调参数
```
  onChangeDrawerVisible = (value) => {
    this.setState({
      drawerVisible: value,
    });
  };
```            
value(boolean):该回调参数返回你执行最新操作时的抽屉开关值
