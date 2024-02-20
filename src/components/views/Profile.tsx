import React, { useEffect, useState } from "react";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User as UserType } from "types";
import User from "models/User";
import { Button } from "../ui/Button";
import { api, handleError } from "helpers/api";

function ActivePlayer({ user, edit }: {
  user: UserType,
  edit: boolean
}) {
  const [changed, setChanged] = useState<boolean>(false);
  const [id, setId] = useState<string>(user.id);
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [birthDate, setBirthDate] = useState<string>( null);
  const [message, setMessage] = useState<string>("");
  const [initialRender, setInitialRender] = useState(true);

  async function updateUser() {
    try {
      const requestBody = JSON.stringify({ id, username, name, birthDate });
      const response = await api.put("/users/" + user.id, requestBody);

      setMessage("User successfully updated.");
      setChanged(false);

    } catch (error) {
      console.log(error);
      /*if (error.response.data.status === 404) {
        setMessage(`${error.response.data.message} \n User not found.`);
      } else {*/
        alert(
          `Something went wrong during the login: \n${handleError(error)}`,
        );
      /*}*/
    }
  }

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      return;
    }
    setChanged(true);
  }, [name, username, birthDate]);

  return (
    <>
      <div className="active-player container">
        <div className="active-player id">
          <div>Id:</div>
          <input key="id" value={user.id} disabled={true} />
        </div>
        <div className="active-player username">
          <div>Username:</div>
          <input key="username" defaultValue={user.username} disabled={!edit}
                 onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="active-player name">
          <div>Name:</div>
          <input key="name" defaultValue={user.name} disabled={!edit} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="active-player member-since">
          <div>Member since:</div>
          <input key="creationDate" value={user.creationDate} disabled={true} />
        </div>
        <div className="active-player birth-date">
          <div>Birth date:</div>
          <input key="birthDate" defaultValue={user.birthDate} disabled={!edit}
                 onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div className="active-player status">
          <div>Status:</div>
          <input key="status" value={user.status} disabled={true} />
        </div>
        <div className="active-player message">{message}</div>
      </div>
      {edit && <Button
        width={100}
        disabled={!changed}
        onClick={() => updateUser()}>
        Save Changes</Button>}
    </>
  );
}


ActivePlayer.propTypes = {
  user: PropTypes.object,
};

function PlayerProfile({ user, edit }: { user: UserType, edit: boolean }) {

  return (
    <BaseContainer className="profile container">
      <ActivePlayer user={user} edit={edit}/>
    </BaseContainer>
  );
}

export default PlayerProfile;
