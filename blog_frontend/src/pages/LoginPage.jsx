import React, {useState} from 'react'
import { Row, Col, Form, Input, Button, Alert } from 'antd';
import login_illustration from '../assets/login_illustration.png';
import { Link } from 'react-router-dom';
import api from '../helper/RestApiHelper';
import AuthHelper from '../helper/AuthHelper';
import { useNavigate } from 'react-router-dom';



function LoginPage() {

  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    
    const username = values.username;
    const password = values.password;

    setLoading(true);
    setError(null);

    await api.post("users/login", 
    {username, password},
    { headers: { requireToken: false }}
    )
    .then(res => {
      
      if (res.status === 200) {
        AuthHelper.setLogin(res.data);
        navigate("/", {replace: true})
      } else {
        setError('An error occurred during login.');
      }
    }).catch(function(error){
      
      if(error.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An error occurred during login.');
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
          <h1>Login</h1>
          <br />
          <Form 
          layout="vertical"
          onFinish={onFinish}>
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
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </Form.Item>
          </Form>

          <p>
          Don't have an account? <Link to="/register">Create a new account</Link>
          </p>

          
          {error && <Alert message={error} type="error" />}


        </div>
      </Col>
    </Row>
  )
}

export default LoginPage