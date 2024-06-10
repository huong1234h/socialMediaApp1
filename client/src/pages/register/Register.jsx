import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const [registered, setRegistered] = useState(false); // Biến trạng thái đăng ký thành công

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL +"auth/register", inputs);
      setErr(null); // Xóa lỗi trước
      setRegistered(true); // Đánh dấu đăng ký thành công
    } catch (err) {
      setErr(err.response.data);
      setRegistered(false); // Đăng ký thất bại
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Nhóm 10 - LTW</h1>
          <p>
            Mạng xã hội là một hệ thống trực tuyến cho phép người dùng kết nối, chia sẻ và tương tác với nhau qua mạng.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login<span> &gt;&gt;</span></button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
          {registered && <Navigate to="/login" replace={true} />}
          {/* Hiển thị chuyển hướng sau khi đăng ký thành công */}
        </div>
      </div>
    </div>
  );
};

export default Register;
