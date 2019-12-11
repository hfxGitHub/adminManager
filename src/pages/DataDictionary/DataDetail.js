import {connect} from 'dva';
import React,{PureComponent} from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
} from 'antd';
import {formItemLayout} from '../../utils/globalUIConfig';
import { DATA_DICTIONARY_DETAIL_STATUS } from '../../utils/Enum';
import { delectBeforeAndBehindBlackRegular } from '../../utils/regular';

const FormItem=Form.Item;
@Form.create()
  @connect(({DataDictionary,loading})=>({
    DataDictionary,
    loading:loading.models.DataDictionary,
  }))

class DataDetail extends PureComponent{
  constructor(props){
    super();
    this.state={}
  }

  componentDidMount(){
    const {dataDetail,dispatch,DataId}=this.props;
    switch (dataDetail) {
      case DATA_DICTIONARY_DETAIL_STATUS.EDIT:
        dispatch({
          type:'DataDictionary/getDataDetail',
          payload:{
            id:DataId
          }
        });
        break;
      case DATA_DICTIONARY_DETAIL_STATUS.ADD:
        dispatch({
          type:'DataDictionary/cleanGetDetail',
        });
        break;
      default:
        break;
    }
  };

  addOrUpdateRole=()=>{
    const { form: { validateFields },dispatch ,dataDetail,onClose,pagination,DataId} = this.props;
    validateFields((error,values)=>{
      if(!error){
        values['type']=values['type'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        values['val']=values['val'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        values['k']=values['k'].replace(delectBeforeAndBehindBlackRegular.reg,"");
        if(dataDetail===DATA_DICTIONARY_DETAIL_STATUS.EDIT){
          dispatch({
            type:'DataDictionary/changeInfo',
            payload:{
              data:{...values,id:DataId},
              pagination:pagination
            }
          })
        }
        else{
          dispatch({
            type:'DataDictionary/addDataDic',
            payload:{
              data:values,
              pagination:{
                currentPage : 1 ,
                pageSize : 10,
              }
            }
          })
        }
        onClose()
      }
    })
  };

  render() {
    const {form:{getFieldDecorator},dataDetail,loading}=this.props;
    const {onClose}=this.props;
    let {DiationaryDetail}=this.props.DataDictionary;
    return (
      <div>
        <FormItem
          {...formItemLayout}
          label="字典类型名">
          {getFieldDecorator('type',{
            initialValue:DiationaryDetail.type||'',
            rules:[{
              required:true,
              whitespace:true,
              message:'请输入字典的名字'
            }]
          })(
            <Input placeholder="请输入字典的名字"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="字典键值">
          {getFieldDecorator('k',{
            initialValue:DiationaryDetail.k||'',
            rules:[{
              required:true,
              whitespace:true,
              message:'请输入字典键值'
            }]
          })(
            <Input placeholder="请输入字典键值"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="字典val">
          {getFieldDecorator('val',{
            initialValue:DiationaryDetail.val||'',
            rules:[{
              required:true,
              whitespace:true,
              message:'请输入字典的值'
            }]
          })(
            <Input placeholder="请输入字典的值"/>
          )}
        </FormItem>
        <Row type="flex" justify="center">
          <Col>
            <Button type={'primary'} onClick={this.addOrUpdateRole} loading={loading}>确定</Button>
          </Col>
          <Col span={1}/>
          <Col>
            <Button onClick={onClose}>取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataDetail;
