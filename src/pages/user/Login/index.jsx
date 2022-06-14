import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { message, Input, Tabs } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import cookie from 'react-cookies';
import { history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { loginSubmit, getSMSCodeLogin } from '@/services/userLogin';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';

const Login = () => {
  const [sliderLift, setSliderLift] = useState(0);
  const [slideContent, setSlideContent] = useState('滑动获取验证码');
  const [visibil, setVisibil] = useState('hidden');
  const [showSquared, setShowSquared] = useState(false);
  const [readonly, setReadonly] = useState(true);
  const [PhoneNum, setPhoneNum] = useState('');
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);
  const [allValues, setallValues] = useState('');
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      // 登录
      if (type === 'mobile') {
        if (!allValues) {
          return setVisibil('visible');
        } else {
          setVisibil('hidden');
        }
        if (allValues !== '111111') {
          return message.error('验证码错误');
        }
        await fetchUserInfo();
        message.success('登录成功！');
        return history.push('/');
      }
      const res = await loginSubmit({ customerCode: 'k131', ...values });
      if (res.IsSuccess == true) {
        message.success('登录成功！');
        const { UserInfo, Token, Power, RefreshToken } = res.ResultInfo;
        localStorage.setItem('currentUser', JSON.stringify(UserInfo));
        localStorage.Token = JSON.stringify(Token);
        localStorage.Power = JSON.stringify(Power);
        localStorage.RefreshToken = RefreshToken;
        await fetchUserInfo();
        // console.log(location.origin, location.href);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        return;
      }

      // setUserLoginState(res);
    } catch (error) {
      console.log(error);
    }
  };
  //发送验证码
  const handelSlide = (e) => {
    if (PhoneNum.length !== 11) {
      return message.error('请输入手机号');
    }
    if (sliderLift >= 280) return;
    const wrap = document.querySelectorAll('.slideWarp')[0]; //获取组件的元素
    const wrapWidth = wrap.offsetWidth; //组件的总长度
    const slideWidth = e.target.offsetWidth; //滑块的width
    const wrapX = e.clientX; //鼠标按下的X轴坐标
    const limitsWidth = wrapWidth - slideWidth; //滑块可拖动的宽度
    let fubg;
    document.onmousemove = (enevt) => {
      //鼠标移动事件
      const moveX = enevt.clientX; //鼠标移动的坐标X
      const left = moveX - wrapX; //滑块的left动态更改
      if (left >= 0 && left <= limitsWidth) {
        //限制滑块只能在组件内滑动
        fubg = left;
        setSliderLift(left); //更新left
      }
    };
    document.onmouseup = (e) => {
      if (fubg < limitsWidth - 5) {
        document.onmousemove = null;
        setSliderLift(0);
        setSlideContent('滑动获取验证码');
        wrap.style.color = '#C2C6CC';
      } else {
        if (fubg >= limitsWidth - 5) {
          setShowSquared(true);
          inputRef1.current.focus();
          getFakeCaptcha().then((res) => {
            message.success(`验证码为：${res.message}`);
          });
        }
        document.onmousemove = null;
        wrap.style.color = '#fff';
        setSlideContent('验证码已发送');
        document.onmouseup = null;
      }
    };
  };
  //6位验证码
  const handleSquared = (e) => {
    switch (e.target.id) {
      case '1':
        setReadonly(false);
        inputRef2.current.focus();
        break;
      case '2':
        inputRef3.current.focus();
        break;
      case '3':
        inputRef4.current.focus();
        break;
      case '4':
        inputRef5.current.focus();
        break;
      case '5':
        inputRef6.current.focus();
        break;
      case '6':
        setallValues(
          inputRef1.current.value +
            inputRef2.current.value +
            inputRef3.current.value +
            inputRef4.current.value +
            inputRef5.current.value +
            inputRef6.current.value,
        );
        break;
    }
  };

  //宫格组配置
  const defConfig = {
    style: {
      width: 40,
      height: 40,
      backgroundColor: '#F7F9FC',
      borderRadius: 6,
      border: 'none',
      textAlign: 'center',
    },
    maxLength: 1,
    onChange: handleSquared,
  };
  // const { returnCode, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="登录"
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab="账户密码登录" />
            <Tabs.TabPane key="mobile" tab="手机号登录" />
          </Tabs>

          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="admin"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="123456"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="phoneNumber"
                onChange={(e) => setPhoneNum(e.target.value)}
                placeholder="手机号(1开头的11位数)"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <div
                style={{
                  height: 40,
                  color: '#C2C6CC',
                  lineHeight: '40px',
                  position: 'relative',
                  backgroundColor: '#F7F9FC',
                  textAlign: 'center',
                  userSelect: 'none',
                }}
                className="slideWarp"
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: sliderLift,
                    // transition: 'width 0.1s',
                    backgroundColor: '#54E993',
                    height: '100%',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  {slideContent}
                </span>
                <div
                  style={{
                    position: 'absolute',
                    left: sliderLift,
                    top: -1,
                    width: 42,
                    height: 42,
                    textAlign: 'center',
                    lineHeight: '42px',
                    color: 'blue',
                    border: 'none',
                    // transition: 'left 0.1s',
                    background: 'linear-gradient(90deg, #FEFEFE, #F0F0F0)',
                    boxShadow: '-4px 0px 8px 0px rgba(121, 119, 133, 0.6)',
                  }}
                  onMouseDown={handelSlide}
                >
                  &gt;
                </div>
              </div>
              <span style={{ color: '#ff4d4f', visibility: visibil }}>请输入验证码!</span>
              {showSquared && (
                <Input.Group style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <input {...defConfig} ref={inputRef1} id={1} />
                  <input {...defConfig} ref={inputRef2} id={2} readOnly={readonly} />
                  <input {...defConfig} ref={inputRef3} id={3} readOnly={readonly} />
                  <input {...defConfig} ref={inputRef4} id={4} readOnly={readonly} />
                  <input {...defConfig} ref={inputRef5} id={5} readOnly={readonly} />
                  <input {...defConfig} ref={inputRef6} id={6} readOnly={readonly} />
                </Input.Group>
              )}
            </>
          )}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
