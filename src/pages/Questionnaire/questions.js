import React, { PureComponent } from 'react';
import { Form, Card, Button, Col, Row, Input, Upload, Icon, message, Modal } from 'antd';
import styles from '../../utils/styles/TableStyle.less';
import { connect } from 'dva';
import { formItemLayout } from '../../utils/globalUIConfig';


const FormItem = Form.Item;
@Form.create()

@connect(({ questionnaireModal, basicdata, loading }) => ({
  questionnaireModal,
  basicdata,
  loadingeditQuestion: loading.effects['questionnaireModal/editQuestion'],
  loadingdeleteQuestion: loading.effects['questionnaireModal/deleteQuestion'],
  loadingAddQuestion: loading.effects['questionnaireModal/addQuestion'],
  loadingGetResponse: loading.effects['questionnaireModal/getResponse'],
}))


class QuestionsTable extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      btnType:0,
      questionId:'',
      questionDetail:'',
    };
  }
  editQuestion=(event)=>{
    const index=event.target.name;
    const { form ,questionData,dispatch,onChangeDrawerVisible} = this.props;
    const formData=form.getFieldsValue();
    const sendData={
      questionDetail:formData['questionDetail'+index],
      questionId:questionData[index].questionId,
      questionnaireId:questionData[index].questionnaireId
    };
    Modal.confirm({
      title: '修改该问题',
      content: '确定修改吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'questionnaireModal/editQuestion',
          payload: sendData,
        });
      },
    });
  };
  //删除
  deleteQuestion=(event)=>{
    const index=event.target.name;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '删除该问题',
      content: '确定删除该问题吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'questionnaireModal/deleteQuestion',
          payload: {
            questionId:this.props.questionData[index].questionId,
            questionnaireId:this.props.questionnaireId
          },
        });
        // onChangeDrawerVisible(false);
      },
    });
  };
  //新增
  addQuestion=()=>{
    const btnType=this.state.btnType;
    if(!btnType){
      this.setState({
        btnType:!btnType
      });
      return ;
    }
    const {questionId,questionDetail}=this.state;
    if(!questionId || !questionDetail){
      message.error('请完善表单!');
      return ;
    }
    const data={
      questionId:Number(questionId),
      questionDetail:questionDetail,
      questionnaireId:this.props.questionnaireId
    };
    const { dispatch, onChangeDrawerVisible } = this.props;
    dispatch({
      type: 'questionnaireModal/addQuestion',
      payload: data,
    });
    this.setState({
      btnType:!btnType
    });
  };
  handleChangeId=(event)=>{
    this.setState({
      questionId:event.target.value
    });
  };
  handleChangeDetail=(event)=>{
    this.setState({
      questionDetail:event.target.value
    });
  };
  render(){
    const {form: { getFieldDecorator },loadingUpdate,loadingGet,questionData}=this.props;
    return(
      <Card bordered={false} loading={loadingGet}>
        <Form style={{ marginTop: 8 }}>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} style={{fontWeight:"bold"}} span={4}>问题id</Col>
            <Col className={styles.Colodd} style={{fontWeight:"bold"}} span={14}>问题详情</Col>
            <Col className={styles.Colodd} style={{fontWeight:"bold"}} span={6}>操作</Col>
          </Row>
          {
            questionData.map((item,index)=>{
              if(item.questionDetail){
                return(
                  <Row className={styles.Row} key={index}>
                    <Col className={styles.Colodd} span={4}>{item.questionId}</Col>
                    <Col className={styles.Colodd} span={14}>
                      {/*<Input value={item.questionDetail} name={index} onChange={this.handleChange.bind(this)}/>*/}
                      <FormItem {...formItemLayout}>
                        {getFieldDecorator('questionDetail'+index, {
                          initialValue: item.questionDetail || '',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input placeholder='问题详情' />)}
                      </FormItem>
                    </Col>
                    <Col className={styles.Colodd} span={6}>
                      <Button type="primary" name={index} onClick={this.editQuestion.bind(this)} loading={loadingUpdate}>修改</Button>
                      <Button type="primary" style={{marginLeft:8}} name={index} onClick={this.deleteQuestion.bind(this)} loading={loadingUpdate}>删除</Button>
                    </Col>
                  </Row>
                )
              }
            })
          }
          {this.state.btnType?(
            <Row className={styles.Row}>
              <Col className={styles.Colodd} span={4}><Input onChange={this.handleChangeId.bind(this)} /></Col>
              <Col className={styles.Colodd} span={14}><Input onChange={this.handleChangeDetail.bind(this)} /></Col>
              <Col className={styles.Colodd} span={6}></Col>
            </Row>
          ):''}
          {
            questionData[0].questionId==-1?( <Row className={styles.Row}>
              <Col className={styles.Colodd} span={10}></Col>
              <Col className={styles.Colodd} span={4}>
                <Button type="primary" loading={loadingUpdate} onClick={this.addQuestion.bind(this)}>{this.state.btnType?'保存':'新增'}</Button>
              </Col>
              <Col className={styles.Colodd} span={10}></Col>
            </Row>):''
          }

          <div style={{height:"10px"}}></div>
          <Row className={styles.Row}>
            <Col className={styles.Colodd} style={{background:"#fff",fontWeight:"bold"}} span={24}>{"全部回复:"}</Col>
          </Row>
          {
            questionData[0].responseData.map((item,index)=>{
              return(
                <Row className={styles.Row} key={index}>
                  <Col className={styles.Colodd} style={{background:"#fff"}} span={5}>{"回复"+(index+1)+":"}</Col>
                  <Col className={styles.Colodd} style={{background:"#fff"}} span={19}>
                    {item.answerDetail}
                  </Col>
                </Row>
              )
            })
          }
        </Form>
      </Card>
    );
  }
}

export default QuestionsTable;
