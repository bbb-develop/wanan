import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isNil } from 'lodash';
import { useGetRooms } from '../../api/getRooms';
import { useGetMatesPending } from '../../api/getMatesPending';
import { useLogin } from '../../api/login';
import { useLogout } from '../../api/logout';
import { Room } from '../../components/Room';
import { LocationForm } from '../../components/LocationForm';
import { useApplicationContext } from '../../providers/applicationProvider';

const StyledContainer = styled.div`
  padding: 24px;
`;

const StyledTopContainer =styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  select {
    margin-right: 12px;
  }

  .token {
    margin-left: 6px;
    font-size: 8px;
    color: #ccc;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledForm = styled.form`
  margin-bottom: 12px;
`;

const StyledInputContainer = styled.div`
  display: flex;
  margin-bottom: 12px;

  label {
    width: 120px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  margin-right: 12px;
  border: 1px solid #999;
  border-radius: 6px;
  padding: 3px 6px;
`;

const StyledButton =styled.button`
  border: 1px solid #999;
  padding: 6px;
  border-radius: 6px;
`;

const StyledRoom = styled(Room)`
  margin-top: 12px;
`;

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { token, setToken, accountConfigs, isLogin, setLogin, deviceConfig } = useApplicationContext();
  const { getRooms } = useGetRooms();
  const { getMatesPending } = useGetMatesPending();
  const { login } = useLogin();
  const { logout } = useLogout();

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = () => {
    login({ name, password})
      .then(() => setLogin(true))
      .catch(() => {setLogin(false)});
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      handleSubmit();
    }
  };

  const handleLogout = () => {
    logout().then(() => {
      setLogin(false);
      setRooms([]);
    });
  };

  useEffect(() => {
    if (!isNil(token)) {
      getRooms({ token })
        .then(setRooms);
      // getMatesPending({ token })
    }
  }, [token, isLogin]);

  return (
    <StyledContainer>
      {!isLogin ? (
        <StyledForm>
          <StyledInputContainer>
            <label>Name</label>
            <StyledInput
              value={name}
              onChange={handleNameChange}
              onKeyPress={handleKeypress}
            />
          </StyledInputContainer>
          <StyledInputContainer>
            <label>Password</label>
            <StyledInput
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeypress}
            />
          </StyledInputContainer>
          <StyledButton type="button" onClick={handleSubmit}>
            Submit
          </StyledButton>
        </StyledForm>
      ) : (
        <StyledTopContainer>
          <select className="select" onChange={handleChange} value={token}>
            <option selected disabled>
              Choose Account
            </option>
            {accountConfigs.map((account) => (
              <option key={account.name} value={account.token}>
                {account.name}
              </option>
            ))}
          </select>
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
          <div className="token">{`${token || "Unselected"}`}</div>
        </StyledTopContainer>
      )}

      {token && <LocationForm />}

      <div>
        {rooms.map((room) => (
          <StyledRoom key={room.id} room={room} />
        ))}
      </div>
    </StyledContainer>
  );
};

export default Home;