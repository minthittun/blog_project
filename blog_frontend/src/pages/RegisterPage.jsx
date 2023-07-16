import React, {useState} from 'react'
import { Row, Col, Form, Input, Button, Alert } from 'antd';
import login_illustration from '../assets/login_illustration.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthHelper from '../helper/AuthHelper';
import api from '../helper/RestApiHelper';


function RegisterPage() {

  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    
    const fullName = values.fullName;
    const username = values.username;
    const password = values.password;

    setLoading(true);
    setError(null);

    await api.post("users/register", 
      { fullName,username, password },
      { headers: { requireToken: false }}
    )
    .then(async res => {
      if (res.status === 200) {
        
        const loginData = { username, password };
        const loginResponse = await axios.post('http://localhost:3000/api/users/login', loginData);
        
        AuthHelper.setLogin(loginResponse.data);

        navigate("/", {replace: true})
        
      } else {
        setError("Username already exists");
      }
    }).catch(function(error){

      if(error.response.status === 400) {
        setError("Username already exists");
      } else {
        setError('Unknown error occurred.');
      }
    });


    setLoading(false);
    
  };


  return (
    <Row style={{ height: '100vh' }}>
      <Col span={12} style={{ background: '#fcfcfc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Welcome!</h1>
          
          <img src={login_illustration} style={{width: '100%'}} alt="Your image" />
        </div>
      </Col>
      <Col span={12} style={{ background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '300px', textAlign: 'center' }}>
          <h1>Register</h1>
          <br />
          <Form 
          layout="vertical"
          onFinish={onFinish}>
          <Form.Item
              name="fullName"
              label="Full name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Loading ....' : 'Register'}
              </Button>
            </Form.Item>
          </Form>

          {error && <Alert message={error} type="error" />}

        </div>
      </Col>
    </Row>
  )
}

export default RegisterPage