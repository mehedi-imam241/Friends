import "./Login.css";
import { Link } from "react-router-dom";
import Button from "../../component/Button/Button";
import Login from "./login.svg";

export default function LoginPage() {
  return (
    <div className="LoginContainer">
      <div className="register-form">
        <img src={Login} alt="Logo" className="register-logo" />
        <h1>Login</h1>

        <p className="addressP"> use your email address:</p>
        <form style={{ textAlign: "center" }}>
          <input
            type="email"
            required
            placeholder="Email"
            // onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            // onChange={(e) => setPassword(e.target.value)}
          />
          <Button buttonName="Login" />
        </form>
        <p className="loginP">
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
