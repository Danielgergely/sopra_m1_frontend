import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        className="register input"
        placeholder="enter here.."
        value={props.value}
        type={props.password ? "password" : "text"}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  password: PropTypes.boolean,
  onChange: PropTypes.func,
};

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      if (error.response.status === 400) {
        setMessage(`${error.response.data.message} \n Try logging in.`);
        setShowLogin(true);
      } else {
        alert(
          `Something went wrong during the login: \n${handleError(error)}`,
        );
      }

    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            password={false}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Name"
            value={name}
            password={false}
            onChange={(n) => setName(n)}
          />
          <FormField
            label="Password"
            value={password}
            password={true}
            onChange={(p) => setPassword(p)}
          />
          <div className="login msg">{message}</div>
          <div className="register button-container">
            <Button
              disabled={!username || !name}
              width={100}
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
          {showLogin && <div className="register button-container">
            <Button
              width={100}
              onClick={() => () => navigate("/login")}
            >
              Login
            </Button>
          </div>}
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Register;
