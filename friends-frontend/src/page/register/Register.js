import Button from "../../component/Button/Button";
import Register from "./register.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validationPassword(psd) {
  return psd.length >= 7;
}
function validateText(psd) {
  return psd.length <= 80;
}
function validatePhoneNumber(num) {
  return !isNaN(num);
}

export default function RegisterCard() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [conFirmPassword, setConFirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const onSubmit = () => {
    axios
      .post("http://localhost:80/api/version1/register_user", {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        address: address,
        zip_code: zip,
        mobile_number: phone,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div id="register">
      <div className="LoginContainer">
        <div className="register-form">
          <img src={Register} alt="Logo" className="register-logo" />
          <h1>Register</h1>

          <p className="addressP">Use your email address:</p>
          <form style={{ textAlign: "center" }}>
            <input
              type="text"
              required
              placeholder="First Name"
              onChange={(e) => {
                if (validateText(e.target.value)) {
                  delete errors.firstName;
                  setFirstName(e.target.value);
                } else {
                  setErrors({ firstName: "*First name too long" });
                }
              }}
            />
            <div className="error">{errors.firstName}</div>
            <input
              type="text"
              required
              placeholder="Last Name"
              onChange={(e) => {
                if (validateText(e.target.value)) {
                  delete errors.LastName;
                  setLastName(e.target.value);
                } else {
                  setErrors({ LastName: "*Last name too long" });
                }
              }}
            />
            <div className="error">{errors.LastName}</div>
            <input
              type="text"
              required
              placeholder="Address"
              onChange={(e) => {
                if (validateText(e.target.value)) {
                  delete errors.address;
                  setAddress(e.target.value);
                } else {
                  setErrors({ address: "*Address too long" });
                }
              }}
            />
            <div className="error">{errors.address}</div>
            <input
              type="text"
              required
              placeholder="ZIP code"
              onChange={(e) => {
                if (validatePhoneNumber(e.target.value)) {
                  delete errors.zip_code;
                  setZip(e.target.value);
                } else {
                  setErrors({ zip_code: "*Zip Code should be number" });
                }
              }}
            />
            <div className="error">{errors.zip_code}</div>
            <input
              type="text"
              required
              placeholder="Phone Number"
              onChange={(e) => {
                if (validatePhoneNumber(e.target.value)) {
                  delete errors.phone;
                  setPhone(e.target.value);
                } else {
                  setErrors({ phone: "*Not a phone number" });
                }
              }}
            />
            <div className="error">{errors.phone}</div>
            <input
              type="email"
              required
              placeholder="Email"
              onChange={(e) => {
                if (validateEmail(e.target.value)) {
                  delete errors.email;
                  setEmail(e.target.value);
                } else setErrors({ email: "*Email not valid" });
              }}
            />
            <div className="error">{errors.email}</div>
            <input
              type="password"
              required
              placeholder="Password"
              onChange={(e) => {
                if (validationPassword(e.target.value)) {
                  delete errors.password;
                  setPassword(e.target.value);
                } else
                  setErrors({
                    password: "*password must be 7 characters long at least",
                  });
              }}
            />
            <div className="error">{errors.password}</div>
            <input
              type="password"
              required
              placeholder="Confirm password"
              onChange={(e) => {
                if (e.target.value === password) {
                  delete errors.confirmPassword;
                  setConFirmPassword(e.target.value);
                } else
                  setErrors({
                    confirmPassword: "*passwords do not match",
                  });
              }}
            />
            <div className="error">{errors.confirmPassword}</div>
            <Button buttonName="Register" onPress={onSubmit} />
          </form>
          <p className="loginP">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
