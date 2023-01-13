import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isNil } from 'lodash';
import { useGetRooms } from '../../api/getRooms';
import { Room } from '../../components/Room';
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
    font-size: 8px;
    color: #ccc;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledRoom = styled(Room)`
  margin-top: 12px;
`;

const Home = () => {
  const [rooms, setRooms] = useState([])
  const { token, setToken, accountConfigs } = useApplicationContext()
  const { getRooms } = useGetRooms();

  const handleChange = (event) => {
    setToken(event.target.value);
  };
  useEffect(() => {
    if (!isNil(token)) {
      getRooms({ token })
        .then(setRooms);
    }
  }, [token])
  return (
    <StyledContainer>
      <StyledTopContainer>
        <select className="select" onChange={handleChange} value={token}>
          <option selected disabled>Choose Account</option>
          {accountConfigs.map((account) => (<option key={account.name} value={account.token}>
            {account.name}
          </option>))}
        </select>
        <div className="token">{`${token || 'Unselected'}`}</div>

      </StyledTopContainer>
      <div>
        {
          rooms.map((room) => (
            <StyledRoom key={room.id} room={room} />
          ))
        }
      </div>
    </StyledContainer>
  );
};

export default Home;