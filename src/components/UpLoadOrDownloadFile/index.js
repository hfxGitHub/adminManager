import React, { PureComponent } from 'react';
import {Upload,Button,Icon } from 'antd';
import remoteLinkAddress from "../../utils/ip";

class AboutFile extends PureComponent{
  constructor(props){
    super(props);
  }
  handleBeforeCheck = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    return isLt2M;
  }

  customerRequest = (...param) =>{
    const {handleUpload} = this.props;
    handleUpload(param[0].file);
}

  render(){
    const {onPreview,onChange,onRemove,fileList=[],success,handleUpload} = this.props;
    return(
      <Upload
        name='file'
        customRequest = {this.customerRequest}
        listType={'text'}
        data={{token: sessionStorage.getItem('token')}}
        defaultFileList={'files'}
        onChange={onChange}
        onSuccess={(a,b)=>{
          console.log(a,b);
          success(a,b)
        }}
        fileList = {fileList}
        onPreview={onPreview}
        beforeUpload={this.handleBeforeCheck}
        onRemove={onRemove}
        accept={".doc,.docx,.png,.xls,xlsx,.png,application/msword,application/" +
        "vnd.openxmlformats-officedocument.wordprocessingml.document"}
      >
        <Button>
          <Icon type="upload"/> Click to Upload
        </Button>
      </Upload>
    )
  }
}
export default AboutFile
