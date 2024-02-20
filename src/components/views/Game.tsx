import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";
import PlayerProfile from "./Profile";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>(null);
  const [activeUser, setActiveUser] = useState<User>(null);

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error,
          )}`,
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details.",
        );
      }
    }

    fetchData().then();
  }, []);

  const showActiveUser = (user: {
    username?: string;
    name?: string;
    id: any;
    creationDate?: string;
    birthDate?: string;
  }) => {
    if (activeUser && user.id === activeUser.id) {
      setActiveUser(null);
    } else {
      setActiveUser(user);
    }
  };

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: User) => (
            <li key={user.id} onClick={() => showActiveUser(user)}>
              <Player user={user} />
            </li>
          ))}
        </ul>
        <Button width={100} onClick={() => logout()}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
      {activeUser && <PlayerProfile user={activeUser} edit={localStorage.getItem("token") === activeUser.token} />}
    </BaseContainer>
  );
};

export default Game;
