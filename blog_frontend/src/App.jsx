import React, { useState } from "react";
import { Navigate, Routes, Route, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Modal } from "antd";
import {
  HomeFilled,
  InfoCircleFilled,
  MessageFilled,
  PlusCircleFilled,
  CloseCircleFilled,
  UserOutlined
} from "@ant-design/icons";
import AuthHelper from "./helper/AuthHelper";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WriteBlogPage from "./pages/WriteBlogPage";
import MyBlogPage from "./pages/MyBlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ConversationPage from "./pages/ConversationPage";


const { Sider, Content } = Layout;

//Private route helper
function RequireAuth({ children }) {
  //initialize auth
  let auth = AuthHelper.getAuth();
  //check is authenticated
  if (!auth) {
      return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  let navigate = useNavigate();
  let isLoggedIn = AuthHelper.isLogin();

  const [openDialog, setOpenDialog] = useState(false);

  const logout = () => {
    setOpenDialog(false);
    AuthHelper.setLogout();
    navigate("/login", {replace: true})
  }

  return (
    <>
      <Modal
        title="Confirm"
        open={openDialog}
        onOk={logout}
        onCancel={()=>setOpenDialog(false)}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure want to log out?</p>
      </Modal>
      <Layout style={{ minHeight: "100vh" }}>
        {
          isLoggedIn &&
          <Sider
          breakpoint="lg"
          trigger={null}
          collapsed={true}
          theme="light"
          style={{ position: "fixed", height: "100vh", left: 0 }}
        >
          <div
            style={{
              width: "100%",
              padding: "30px 10px",
              fontWeight: "bold",
              fontSize: "28px",
            }}
          >
            <div style={{textAlign: 'center'}}>
              
              <Button
                type="primary"
              >
                <b>B</b>
              </Button>
            </div>
          </div>

          <Menu
            style={{borderRight: 'none'}}
            onClick={({ key }) => {
              
              if(key === "logout"){
                  setOpenDialog(true);
              } else {
                navigate(key);
              }
            }}
            theme="light"
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
            items={[
              {
                type: "group",
                key: "main_sub_menu",
                label: "",
                children: [
                  {
                    key: "/writeBlog",
                    icon: <PlusCircleFilled />,
                    label: "Write",
                  },
                  {
                    key: "/",
                    icon: <HomeFilled />,
                    label: "Home",
                  },
                  {
                    key: "/conversation",
                    icon: <MessageFilled />,
                    label: "Chat",
                    to: "/conversation",
                  },
                  {
                    key: "/about",
                    icon: <InfoCircleFilled />,
                    label: "About",
                    to: "/about",
                  },
                  {
                    key: "logout",
                    icon: <CloseCircleFilled />,
                    label: "Logout"
                  },
                ],
              },
            ]}
          />
        </Sider>
        }
        <Layout style={
          isLoggedIn ?
          { marginLeft: 80 }
          :
          { marginLeft: 0 }
        }>
          
          <Content
            //style={{ background: "#fff", overflow: "initial", marginTop: 74 }}
            style={{ background: "#fcfcfc", overflow: "initial", marginTop: 0 }}
          >
            <Routes>
              {/* public route */}
              <Route path="/login" element={<LoginPage />} ></Route>
              <Route path="/register" element={<RegisterPage />} ></Route>
              {/* private route */}
              <Route path="/" element={<RequireAuth><BlogPage /> </RequireAuth>} ></Route>
              <Route path="/myblog/:userId" element={<RequireAuth><MyBlogPage /> </RequireAuth>} ></Route>
              <Route path="/writeBlog" element={<RequireAuth><WriteBlogPage /> </RequireAuth>} ></Route>
              <Route path="/writeBlog/:id" element={<RequireAuth><WriteBlogPage /> </RequireAuth>} ></Route>
              <Route path="/postDetail/:id" element={<RequireAuth><BlogDetailPage /> </RequireAuth>} ></Route>
              <Route path="/about" element={<RequireAuth><AboutPage /> </RequireAuth>} ></Route>
              <Route path="/conversation" element={<RequireAuth><ConversationPage /> </RequireAuth>} ></Route>
              {/* private route */}
             
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
