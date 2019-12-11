import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import 'braft-editor/dist/index.css';
import { formItemLayout } from '../../utils/globalUIConfig';
import DrugDetailTable from './DrugDetailTable'

const FormItem = Form.Item;
@Form.create()

@connect(({ orderModal, loading }) => ({
  orderModal,
  loading,
}))
class OrderDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleStateChange = (value) => {

  };
  getNoticeTime=()=>{
    const date=new Date();
    let time='';
    let month=date.getMonth()+1;
    let days=date.getDate();
    let hours=date.getHours();
    let minutes=date.getMinutes();
    let senconds=date.getSeconds();
    month=month<10?'0'+month:month;
    days=days<10?'0'+days:days;
    hours=hours<10?'0'+hours:hours;
    minutes=minutes<10?'0'+minutes:minutes;
    senconds=senconds<10?'0'+senconds:senconds;
    time+=date.getFullYear()+'-'+month+'-'+days+'T';
    time+=hours+':'+minutes+':'+senconds+'.000+0000';
    return time;
  };


  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const {
      form: { getFieldDecorator },
      closeFunction,
      loadingUpdate,
      loadingGet,
      editFlag
    } = this.props;
    //查看订单详情
    let {orderModal:{detailData}}=this.props;
    detailData=detailData;
    if (!detailData.hasOwnProperty('order')) {
      return (
        <div></div>
      );
    }
    const contentOptions = {
      detailData:detailData,
      onChangeDrawerVisible:this.props.onChangeDrawerVisible,
      loadingUpdate:loadingUpdate,
      loadingGet:loadingGet
    };
    return (
      <Card bordered={false} loading={loadingGet}>
        <DrugDetailTable {...contentOptions} loading={loadingGet} />
      </Card>
    );
  }
}

export default OrderDetail;
