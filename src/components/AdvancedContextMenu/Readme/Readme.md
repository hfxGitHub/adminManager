右键菜单组件
==========
该组件基于Popover封装，提供右键菜单功能

1，用法
----------
你可以通过引用AdvancedContextMenu，包裹你自己的组件，实现右键菜单功能
```
 <AdvancedContextMenu
                    content={menuItemContent}
                  >
                    <span>{pane.title}
                      &nbsp;&nbsp;
                    </span>
                  </AdvancedContextMenu>
```

2，参数
-------------
content(array):传入一个数组配置你的菜单,数组的每一项是一个object包含以下三项

label（string）：菜单项的名称

func（function）：点击菜单项执行的函数

disable（boolean）：该菜单项是否可点击

```
[
      {
        label: '刷新',
        func: this.closeOtherTabs,
        disable: true,
      },
      {
        label: '关闭其他',
        func: () => {
          this.closeOtherTabs();
        },
      },
      {
        label: '关闭左侧窗口',
        func: () => {
          this.closeLeftTabs();
        },
      },
      {
        label: '关闭右侧窗口',
        func: () => {
          this.closeRightTabs();
        },
      },
    ];
```

3，拓展
---------
exContent（reactElement）：你可以通过该参数传入你的自定义菜单项

注意：传入后，你通过content参数配置出来的菜单将不会渲染
