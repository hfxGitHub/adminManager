import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input, Upload, Modal, Icon } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import 'braft-editor/dist/index.css';
import remoteLinkAddress from '../../utils/ip';
import { formItemLayout, lineItem } from '../../utils/globalUIConfig';
import AdvancedSelect from '../../components/AdvancedSelect';
import { EDIT_FLAG, ITEMTYPE, IMG_URL } from '../../utils/Enum';

const FormItem = Form.Item;

@Form.create()
@connect(({ noticesModal, basicdata, loading }) => ({
  noticesModal,
  basicdata,
  loadingUpdate: loading.effects['noticesModal/edit'],
  loadingAdd: loading.effects['noticesModal/add'],
  loadingGet: loading.effects['noticesModal/getDetail'],
}))
class NoticesDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      files: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.transfer(nextProps);
  }

  handleStateChange = (value) => {

  };

  add = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'noticesModal/add',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };

  update = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'noticesModal/edit',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };

  componentWillReceiveProps(nextProps) {
    this.transfer(nextProps);
  }

  submitForm = () => {
    const { form, noticesModal: { editFlag, id } } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let sendData = form.getFieldsValue();
        switch (editFlag) {
          case EDIT_FLAG.EDIT:
            sendData = {
              ...sendData,
            };
            this.update(sendData);
            break;
          case EDIT_FLAG.ADD:
            sendData = {
              ...sendData,
            };
            this.add(sendData);
            break;
          default:
            break;
        }
      }
    });
  };


  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    fileList = fileList.slice(-1);
    const { dispatch } = this.props;
    dispatch({
      type: `noticesModal/save`,
      payload: {
        imgList: fileList,
      },
    });
    this.setState({
      files: fileList,
    });
    return fileList;
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
  }

  handleBeforeCheck = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    return isLt2M;
  };

  transfer = (props) => {
    const { noticesModal: { detailData } } = props || this.props;
    const url = remoteLinkAddress();
    let newFiles = [];
    if (detailData) {
      newFiles = [{
        uid: detailData.id,
        // name: detailData.data.itemTypeName,
        status: 'success',
        // url:IMG_URL+detailData.itemTypeImg,
        key: 1,
      }];
    }
    this.setState({
      files: newFiles,
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      closeFunction,
      loadingUpdate,
      loadingGet,
    } = this.props;
    let { noticesModal: { detailData } } = this.props;
    const { previewVisible, previewImage, files } = this.state;
    const url = remoteLinkAddress();
    const fileProps = {
      name: 'file',
      action: `${url}/NOTICE/upload`,
      listType: 'picture',
      data: {
        id: detailData,
        token: sessionStorage.getItem('token'),
      },
      fileList: files,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      beforeUpload: this.handleBeforeCheck,
    };
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="公告id">
                {getFieldDecorator('noticeId', {
                  initialValue: detailData.noticeId || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请输入公告id'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={24}>
              <FormItem {...formItemLayout} label="发布时间" readOnly="readOnly">
                {getFieldDecorator('noticeTime', {
                  initialValue: detailData.noticeTime || this.getNoticeTime(),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请输入发布时间' readOnly="readOnly"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="公告详情">
                {getFieldDecorator('noticeDetail', {
                  initialValue: detailData.noticeDetail || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请输入公告内容'/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="用户id">
                {getFieldDecorator('userId', {
                  initialValue: detailData.userId || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请输入用户id'/>,
                )}
              </FormItem>
            </Col>
          </Row>
          {/*<Row>*/}
            {/*<Col span={4}/>*/}
            {/*<Col span={12}>*/}
              {/*<FormItem {...lineItem} label="图片修改">*/}
                {/*<Upload {...fileProps}>*/}
                  {/*<Button>*/}
                    {/*<Icon type="upload"/>点击上传*/}
                  {/*</Button>*/}
                {/*</Upload>*/}
                {/*<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>*/}
                  {/*<img alt="example" style={{ width: '100%' }} src={previewImage}/>*/}
                {/*</Modal>*/}
              {/*</FormItem>*/}
            {/*</Col>*/}
          {/*</Row>*/}
        </Form>
        <FooterToolbar style={{ width: '100%' }}>
          <Button type="primary" onClick={this.submitForm} loading={loadingUpdate}>
            保存
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={closeFunction}>
            取消
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default NoticesDetail;
