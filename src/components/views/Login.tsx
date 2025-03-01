import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(null);

  const doLogin = async () => {
    try {
      const response = await api.get("/users/login?username=" + username +"&password=" + password);

      // Get the returned user and update a new object.
      const user = new User(response.data);
      console.log(user);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      if (error.response.data.status === 404) {
        setMessage(`${error.response.data.message} \n Please check your entries, or register a new user.`);
        setShowRegister(true);
      } else {
        alert(
          `Something went wrong during the login: \n${handleError(error)}`,
        );
      }

    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            password={false}
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            password={true}
            onChange={(p) => setPassword(p)}
          />
          <div className="login msg">{message}</div>
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width={100}
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          {showRegister &&
            <div className="login button-container"><Button
              width={100}
              onClick={() => navigate("/register")}
            >
              Register
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
export default Login;
