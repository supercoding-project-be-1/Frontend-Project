import React, {useState} from 'react';
import {TextField} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {blue, CustomButton} from './CustomButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({
    email: '',
    password: ''
  });

  const loginAddHandler = async () => {
    navigate('/add')
  }

  const loginHandler = async (path, email, password) => {
    console.log("로그인 확인");
    try {
      const response = await fetch(`http://localhost:8080${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      console.log("data >> ",data);
      console.log("path >> ",path);
      if (path === '/api/login' && data.message === 'success') {
        localStorage.setItem('email', email);
        navigate('/list');
      } else {
        console.error('로그인 실패:', data.message);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  return (
    <div style={{
      padding: '40px'
    }}>
      <h1>로그인 페이지</h1>
      <h2>이메일</h2>
      <TextField id="outlined-basic" label="이메일을 입력해주세요." variant="outlined" onChange={(event) => setLoginState(prev => ({...prev, email: event.target.value}))}/>
      <h2>비밀번호</h2>
      <TextField id="outlined-basic" label="비밀번호를 입력해주세요." variant="outlined" onChange={(event) => setLoginState(prev => ({...prev, password: event.target.value}))}/>
      <div style={{
        marginTop: '20px'
      }}>
        <CustomButton style={{ backgroundColor: blue[900] }} onClick={() => loginAddHandler('/add', )}>회원가입</CustomButton>
        <CustomButton style={{ backgroundColor: blue[500] }} onClick={() => loginHandler('/api/login', loginState.email, loginState.password)}>로그인</CustomButton>
      </div>
    </div>
  );
};

export default LoginPage;
