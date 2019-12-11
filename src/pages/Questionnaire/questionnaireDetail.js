import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Col, Row, Input, Upload, Icon, message, Modal } from 'antd';
import { EDIT_FLAG, PIICKLOG } from '../../utils/Enum';
import FooterToolbar from '@/components/FooterToolbar';
import styles from '../../utils/styles/TableStyle.less';
import { justChinese } from '../../utils/regular';
import { formItemLayout, lineItem } from '../../utils/globalUIConfig';
import QuestionsTable from './questions';

const FormItem = Form.Item;

@Form.create()
@connect(({ questionnaireModal, basicdata, loading }) => ({
  questionnaireModal,
  basicdata,
  loadingGet: loading.effects['questionnaireModal/getGuide'],
  loadingAdd: loading.effects['questionnaireModal/add'],
  loadingEdit: loading.effects['questionnaireModal/edit'],
}))
class QuestionnaireDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  add = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'questionnaireModal/add',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };
  update = (data) => {
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'questionnaireModal/edit',
      payload: data,
    });
    onChangeDrawerVisible(false);
  };
  submitForm = () => {
    const { form, questionnaireModal: { editFlag, id } } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let sendData = form.getFieldsValue();
        switch (editFlag) {
          case EDIT_FLAG.EDIT:
            sendData = sendData.detailData;
            this.update(sendData);
            break;
          case EDIT_FLAG.ADD:
            sendData = sendData.detailData;
            this.add(sendData);
            break;
          default:
            break;
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      closeFunction,
      loadingUpdate,
      loadingGet,
      editFlag,
    } = this.props;
    //查看问题详情
    if (editFlag == 3) {
      let {questionnaireModal:{questionData}}=this.props;
      questionData=questionData.list;
      if (!questionData) {
        return (
          <div></div>
        );
      }
      const contentOptions = {
        questionData:questionData,
        questionnaireId:this.props.checks[0].questionnaireId,
        onChangeDrawerVisible:this.props.onChangeDrawerVisible,
        loadingUpdate:loadingUpdate,
        loadingGet:loadingGet
      };
      return (
        <Card bordered={false} loading={loadingGet}>
          <QuestionsTable {...contentOptions} loading={loadingGet} />
        </Card>
      );
    }
    let detail = [];
    const { questionnaireModal: { detailData } } = this.props;
    detail = detailData;
    return (
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          <Row type="flex" justify="center">
            <Col span={12}>
              <FormItem {...lineItem} label="问卷Id">
                {getFieldDecorator('detailData.questionnaireId', {
                  initialValue: detail.questionnaireId || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请输入问卷Id'/>)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...lineItem} label="问卷标题">
                {getFieldDecorator('detailData.questionnaireTitle', {
                  initialValue: detail.questionnaireTitle || '',
                  rules: [
                    {
                      required: true,
                      message: '标题必填！',
                      whitespace: true,
                    },
                  ],
                })(
                  <Input placeholder='请输入问卷标题'/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}/>
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

export default QuestionnaireDetail;
