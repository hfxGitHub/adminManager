import React, { PureComponent } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

class AdvancedSelect extends PureComponent {

  static propTypes = {
    dataSource : PropTypes.array.isRequired,//下拉列表框的数据源
    onChange : PropTypes.func.isRequired,//发生改变时的操作
    type : PropTypes.string,//针对比较固定的下拉列表框
    fieldConfig:PropTypes.object,//数据源选择
    searchType:PropTypes.string,//目前提供了本地查询和模糊查询两种模式

  };
  // static defaultProps = {
  //   dataSource : [],
  // };

  constructor(props) {
    super(props);
    this.state = {
      value : props.value || '',
      optionData : [],
      currentConfig : {},
    };
    this.defaultComponentConfig = {
      LOCALSEARCH : {
        optionFilterProp : 'children',
        filterOption : this.handleLocalSearch,//实现了本地的搜索
        showSearch : true,
      },
      FUZZYSEARCH : {
        onSearch : (v) => this.handleSearch(v, 'pinyin'),
        showSearch : true,
        filterOption : false,
      },
    };
    this.defaultFiledConfig = {
      key : 'value',
      value : 'value',
      text : 'text',
    };
    this.defaultConfig = {
      //所有用户的模糊查询
      USER_FUZZYSEARCH : {
        fieldConfig : {
          key : 'id',
          value : 'id',
          text : 'nickname',
        },
        componentConfig : {
          onSearch : (v) => this.handleSearch(v, 'userPy'),
          showSearch : true,
          filterOption : false,
        },
      },
      DATADICT : {
        fieldConfig : {
          key : 'k',
          value : 'k',
          text : 'val',
        },
        componentConfig : {
          optionFilterProp : 'children',
          filterOption : this.handleLocalSearch,//实现了本地的搜索
          showSearch : true,
        },
      },
      GOODSTYPE : {
        fieldConfig : {
          key : 'goodsTypeId',
          value : 'goodsTypeId',
          text : 'goodsType',
        },
        componentConfig : {
          onSearch : (v) => this.handleSearch(v, 'pinyin'),
          showSearch : true,
          filterOption : false,
        },
      },
      DEPARTMENT : {
        fieldConfig : {
          key : 'id',
          value : 'id',
          text : 'departmentName',
        },
        componentConfig : {
          onSearch : (v) => this.handleSearch(v, 'departmentName'),
          showSearch : true,
          filterOption : false,
        },
      },
      ROLE : {
        fieldConfig : {
          key : 'id',
          value : 'id',
          text : 'name',
        },
        componentConfig : {
          onSearch : (v) => this.handleSearch(v, 'name'),
          showSearch : true,
          filterOption : false,
        },
      },
      EDEPARTMENT : {
        fieldConfig : {
          key : 'departmentId',
          value : 'departmentId',
          text : 'depName',
        },
        componentConfig : {
          optionFilterProp : 'children',
          filterOption : this.handleLocalSearch,//实现了本地的搜索
          showSearch : true,
        },

      },
      DEFAULT : {
        fieldConfig : {
          key : 'value',
          value : 'value',
          text : 'text',
        },
        componentConfig : {
          optionFilterProp : 'children',
          filterOption : this.handleLocalSearch,//实现了本地的搜索
          showSearch : true,
        },
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const {currentConfig:originConfig} = this.state
    if ('value' in nextProps && this.props.value !== nextProps.value) {
      this.setState({
        value : nextProps.value,
      });
    }

    if ('dataSource' in nextProps && this.props.dataSource.length !== nextProps.dataSource.length) {
      this.setState({ optionData : nextProps.dataSource });
    }
    if('fieldConfig' in nextProps){
      this.setState({
        currentConfig : {...originConfig,fieldConfig:nextProps.fieldConfig}
      });
    }
  }

  componentDidMount() {
    const { dataSource, type, fieldConfig= this.defaultFiledConfig , searchType = 'LOCALSEARCH' } = this.props;
    let config;
    if (type) {
      config = this.defaultConfig[type];
    }
    else {
      config = {
        fieldConfig : fieldConfig,
        componentConfig : this.defaultComponentConfig[searchType],
      };
    }
    this.setState({ currentConfig : config });
    this.setState({ optionData : dataSource });
  }

  handleChange = (value) => {
    this.setState({ value });
    let { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  handleLocalSearch = (input, option) => {
    option.props.children.indexOf(input) >= 0;
  };

  handleSearch = (value, searchType) => {
    const { dataSource } = this.props;
    const res = dataSource.filter((v) => {
      return v[searchType].indexOf(value) != -1;
    });
    this.setState({ optionData : res });
  };

  constructOptions = () => {
    const { optionData } = this.state;
    const { fieldConfig } = this.state.currentConfig;
    if (fieldConfig) {
      return optionData.map((item) => {
        return (
          <Option
            key={item[fieldConfig.key]}
            value={item[fieldConfig.value]}
          >
            {item[fieldConfig.text]}
          </Option>
        );
      });
    } else {
      return;
    }
  };

  render() {
    const { currentConfig : { componentConfig } } = this.state;
    const { dataSource, type, onChange, ...otherProps } = this.props;
    const config = { ...componentConfig, ...otherProps };//允许其他设置

    return (
      <Select value={this.state.value} onChange={this.handleChange} {...config}>
        {this.constructOptions()}
      </Select>
    );
  }
}

export default AdvancedSelect;
