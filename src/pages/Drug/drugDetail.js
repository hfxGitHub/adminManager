import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input, Upload, Icon, Modal, DatePicker } from 'antd';
import { EDIT_FLAG, IMG_URL } from '../../utils/Enum';
import FooterToolbar from '@/components/FooterToolbar';
import 'braft-editor/dist/index.css';
import { lineItem, entireLine } from '../../utils/globalUIConfig';
import remoteLinkAddress from '../../utils/ip';
import AdvancedSelect from '../../components/AdvancedSelect/index';

const FormItem = Form.Item;

@Form.create()
@connect(({ drugModal, basicdata, loading }) => ({
  drugModal,
  basicdata,
  loadingUpdate: loading.effects['drugModal/edit'],
  loadingGet: loading.effects['drugModal/getDetail'],
}))
class Drug extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      previewVisible: false,
      files: [],
      groupId: this.props.drugModal.detailData.groupId,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.transfer(nextProps);
  }


  add = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'drugModal/add',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };

  update = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'drugModal/edit',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };

  submitForm = () => {
    const { form, drugModal: { editFlag, id, detailData } } = this.props;
    const { files } = this.state;
    let data = {};
    form.validateFields((err) => {
      if (!err) {
        const sendData = form.getFieldsValue();
        switch (editFlag) {
          case EDIT_FLAG.EDIT:
            data = {
              drugId: detailData.drugId,
              drugInformation: sendData.drugInformation,
              drugName: sendData.drugName,
              drugPrice: sendData.drugPrice,
              groupId: this.state.groupId,
            };
            this.update(data);
            break;
          case EDIT_FLAG.ADD:
            data = {
              drugInformation: sendData.drugInformation,
              drugName: sendData.drugName,
              drugPrice: sendData.drugPrice,
              groupId: this.state.groupId,
            };
            this.add(data);
            break;
          default:
            break;
        }
      }
    });
  };

  transfer = (props) => {
    const { drugModal: { detailData } } = props || this.props;
    const url = remoteLinkAddress();
    let newFiles = [];
    if (detailData) {
      newFiles = [{
        uid: detailData.drugId,
        name: detailData.drugName,
        status: 'success',
        url: remoteLinkAddress() + detailData.drugId,
      }];
    }
    this.setState({
      files: newFiles,
    });
  };

  handleChange = ({ fileList }) => {
    fileList = fileList.slice(-1);
    this.setState({
      files: fileList,
    });
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleBeforeCheck = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    return isLt2M;
  };

  getDrugGroup = data => {
    let drupGroupData = [];
    data.forEach((item) => {
      drupGroupData.push({
        'k': item.groupId.toString(),
        'val': item.groupName,
      });
    });
    return drupGroupData;
  };

  oldGroupName = (data, id) => {
    let name = '';
    data.forEach((item) => {
      if (item['k'] == id) {
        name = item.val;
      }
    });
    return name;
  };
  // newGroupId=(data,name)=>{
  //   let id;
  //   console.log(name);
  //   console.log(data[0]['groupName']);
  //   data.forEach((item)=>{
  //     if(item['groupName']==name){
  //       id=item['groupId'];
  //     }
  //   });
  //   return id||name;
  // };

  handleProviderChange = value => {
    this.setState({
      groupId: value,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const {
      form: { getFieldDecorator },
      closeFunction,
      loadingUpdate,
      loadingGet,
    } = this.props;
    let { drugModal: { detailData, editFlag } } = this.props;
    if (editFlag == 0) {
      detailData = {};
    }
    const { previewVisible, previewImage, files } = this.state;
    const url = remoteLinkAddress();
    const fileProps = {
      name: 'file',
      action: url + '/drug/logo/upload/' + detailData.drugId,
      listType: 'picture',
      data: {
        id: detailData.drugId,
      },
      fileList: files,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      beforeUpload: this.handleBeforeCheck,
    };
    const { drugModal: { groupData } } = this.props;
    const drupGroupData = this.getDrugGroup(groupData);
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...lineItem} label="药品名称">
                {getFieldDecorator('drugName', {
                  initialValue: detailData.drugName || '',
                  rules: [
                    {
                      required: true,
                      message: '标题必填！',
                      whitespace: true,
                    },
                  ],
                })(
                  <Input placeholder='请输入药品名称'/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="药品说明">
                {getFieldDecorator('drugInformation', {
                  initialValue: detailData.drugInformation || '',
                  rules: [
                    {
                      required: true,
                      message: '药品说明必填！',
                      max: 20,
                      min: 1,
                      whitespace: true,
                    },
                  ],
                })(<Input placeholder='请输入药品说明'/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="药品价格">
                {getFieldDecorator('drugPrice', {
                  initialValue: detailData.drugPrice || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Input placeholder='请输入药品价格'/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...lineItem} label="药品分组">
                {getFieldDecorator('groupId', {
                  initialValue: this.oldGroupName(drupGroupData, detailData.groupId) || '',
                  rules: [
                    {
                      required: true,
                      // regCode: 'number',
                    },
                  ],
                })(<AdvancedSelect dataSource={drupGroupData} type="DATADICT" onChange={this.handleProviderChange}/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}/>
          </Row>
          <Row>
            <Col span={12}>
              <Upload {...fileProps}>
                <Button>
                  <Icon type="upload"/>点击上传
                </Button>
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage}/>
              </Modal>
            </Col>
          </Row>
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

export default Drug;
