import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Input, Button, Row, Col, Form, message} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import sha1 from 'sha1';

const { Tab, UserName, Password, Mobile, Captcha, Submit} = Login;
const FormItem = Form.Item;
let getCaptchaArr=[0,1,2,3,4,5,6,7,8,9];
@Form.create()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    captcha:''
  };

  componentDidMount=()=>{
    this.getCaptchaArr()
    this.getCaptcha();
  }

  onTabChange = type => {
    this.setState({ type });
  };

  getCaptchaArr=()=>{
    for (let i=0;i<=25;i++){
      getCaptchaArr.push(String.fromCharCode((65+i)));
    }
  };

  getCaptcha=()=>{
    let str=''
    for(let i=0;i<4;i++){
      str=str+getCaptchaArr[Math.floor(Math.random()*36)]
    }
    this.setState({
      captcha: str
    })
  };

  // onGetCaptcha = () =>
  //   new Promise((resolve, reject) => {
  //     this.loginForm.validateFields(['mobile'], {}, (err, values) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         const { dispatch } = this.props;
  //         dispatch({
  //           type: 'login/getCaptcha',
  //           payload: values.mobile,
  //         })
  //           .then(resolve)
  //           .catch(reject);
  //       }
  //     });
  //   });

  handleSubmit = (err, values) => {
    const userInfo=values;
    const {form:{validateFields }}=this.props;
    validateFields((errors,values)=>{
      if(!errors){
        if(values.InputCaptcha.toUpperCase()!=this.state.captcha){
          message.error("验证码错误")
          this.getCaptcha()
          return ;
        }
        else{
          let user={}
          user={
            ...userInfo,
            password:userInfo.password,
            // password:sha1(userInfo.password),
          }
          const { type } = this.state;
          if (!err) {
            const { dispatch } = this.props;
            console.log(this.props)
            dispatch({
              type: 'login/login',
              payload: {
                ...user,
                // type,
              },
            });
            this.getCaptcha()
          }
        }
      }
    })
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    let yanzhengma=this.state.captcha;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="username"
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Row>
              <Col span={16}>
                <FormItem>
                  {getFieldDecorator('InputCaptcha',{
                    rules:[{
                      required:true,
                      message:'请输入验证码'
                    }]
                  })(
                    <Input size="large"  placeholder="请输入验证码"/>
                  )}
                </FormItem>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Button block={true} size='large' id="getCaptcha" onClick={this.getCaptcha} style={{"color":"#1890FF"}}>{yanzhengma}</Button>
              </Col>
            </Row>
          </Tab>
          {/*<Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>*/}
            {/*{login.status === 'error' &&*/}
            {/*login.type === 'mobile' &&*/}
            {/*!submitting &&*/}
            {/*this.renderMessage(*/}
              {/*formatMessage({ id: 'app.login.message-invalid-verification-code' })*/}
            {/*)}*/}
            {/*<Mobile*/}
              {/*name="mobile"*/}
              {/*placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}*/}
              {/*rules={[*/}
                {/*{*/}
                  {/*required: true,*/}
                  {/*message: formatMessage({ id: 'validation.phone-number.required' }),*/}
                {/*},*/}
                {/*{*/}
                  {/*pattern: /^1\d{10}$/,*/}
                  {/*message: formatMessage({ id: 'validation.phone-number.wrong-format' }),*/}
                {/*},*/}
              {/*]}*/}
            {/*/>*/}
            {/*<Captcha*/}
              {/*name="captcha"*/}
              {/*placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}*/}
              {/*countDown={120}*/}
              {/*onGetCaptcha={this.onGetCaptcha}*/}
              {/*getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}*/}
              {/*getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}*/}
              {/*rules={[*/}
                {/*{*/}
                  {/*required: true,*/}
                  {/*message: formatMessage({ id: 'validation.verification-code.required' }),*/}
                {/*},*/}
              {/*]}*/}
            {/*/>*/}
          {/*</Tab>*/}
          <div>
            {/*<Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>*/}
              {/*<FormattedMessage id="app.login.remember-me" />*/}
            {/*</Checkbox>*/}
            {/*<a style={{ float: 'right' }} href="">*/}
              {/*<FormattedMessage id="app.login.forgot-password" />*/}
            {/*</a>*/}
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div className={styles.other}>
            {/*<FormattedMessage id="app.login.sign-in-with" />*/}
            {/*<Icon type="alipay-circle" className={styles.icon} theme="outlined" />*/}
            {/*<Icon type="taobao-circle" className={styles.icon} theme="outlined" />*/}
            {/*<Icon type="weibo-circle" className={styles.icon} theme="outlined" />*/}
            <Link className={styles.register} to="/user/register">
              {/*<FormattedMessage id="app.login.signup" />*/}
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
