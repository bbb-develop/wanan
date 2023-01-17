import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useGetRoomHistories } from '../../api/getRoomHistories';
import { useGetProfessions } from '../../api/getProfessions';
import { usePostRoomMessage } from '../../api/postRoomMessage';
import { useApplicationContext } from '../../providers/applicationProvider';


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100vh;
`;

const StyledTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StyledProfile = styled.div`
  display: flex;
`;

const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledImageContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 6px;
  
  img {
    width: 100%;
  }
`;

const StyledTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const StyledButton =styled.button`
  border: 1px solid #999;
  padding: 6px;
  border-radius: 6px;
`;

const StyledContent = styled.div`
  padding: 24px;
  border: 1px solid #999;
  border-radius: 12px;
  max-height: 100vh;
  overflow: auto;
}
`;

const StyledMessage = styled.div`
  color: ${({ isMe }) => (isMe ? 'blue' : 'crimson')};
  text-align: ${({ isMe }) => (isMe ? 'right' : 'left')};
  margin-top: 12px;

  .text {
    display: inline-flex;
    flex-direction: column;
    max-width: 90%;
    color: ${({ roomType }) => {
      if (roomType === 5) return 'green';
      if (roomType === 3) return 'purple';
      return 'unset';
    }};
    padding: 12px;
    border: 1px solid #999;
    border-radius: 12px;

    .audio {
      color: green;
    }

    .time {
      color: #999;
      font-size: 6px;
      margin-top: 6px;
    }
  }
`;

const StyledTime = styled.div`
  color: #999;
  font-size: 6px;
  margin-top: 6px;
`;

const StyledInputContainer = styled.div`
  display: flex;
  margin-top: 12px;
`;

const StyledInput = styled.input`
  width: 100%;
  margin-right: 12px;
  border: 1px solid #999;
  border-radius: 6px;
  padding: 3px 6px;
`;

const RoomHistory = () => {
  const { roomId } = useParams();
  const { token } = useApplicationContext()
  const [info, setInfo] = useState({});
  const [professionInfo, setProfessionInfo] = useState({});
  const [value, setValue] = useState('');

  const userId = info?.other?.id;
  const clearPicture = info?.other?.clearPicture;
  const { lastActive } = professionInfo;

  const { getRoomHistories } = useGetRoomHistories();
  const { postRoomMessage } = usePostRoomMessage();
  const { getProfessions } = useGetProfessions();

  const handleGetRoomHistories = () => {
    getRoomHistories({ token, roomId })
      .then(setInfo);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    postRoomMessage({ message: value, token, roomId })
      .then(() => {
        setValue('');
        handleGetRoomHistories();
      });
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    console.log(e);
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (roomId && token) {
      handleGetRoomHistories();
    }
  }, [token, roomId]);

  useEffect(() => {
    if (userId && token) {
      getProfessions({ userId, token })
        .then(setProfessionInfo);
    }
  }, [token, userId]);

  const { me, other: user, histories = [] } = info;

  return (
    <StyledContainer>
      <StyledTopContainer>
        <StyledProfile>
          <StyledImageContainer>
            <img src={clearPicture?.url} />
          </StyledImageContainer>
          <StyledTitleContainer>
            <StyledTitle>{user?.name}</StyledTitle>
            {lastActive && (<StyledTime>{new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Taipei' }).format(new Date(lastActive))}</StyledTime>)}
          </StyledTitleContainer>
        </StyledProfile>
        <StyledButton onClick={() => handleGetRoomHistories()}>Refresh</StyledButton>
      </StyledTopContainer>
      <StyledContent>
        {
          histories.map((history) => {
            const isMe = history?.user?.id === me?.id;
            return (
              <StyledMessage
                key={history.id}
                isMe={isMe}
                roomType={history?.roomType}
              >
                <span className="text">
                  { history.roomType === 5 && (
                    <a
                      className="audio"
                      href={history?.audio}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Audio
                    </a>
                  )}
                  { history?.roomType === 4 && history?.message}
                  { history?.roomType === 3 && 'Phone Call'}
                  <span className="time">{new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Taipei' }).format(new Date(history?.updatedAt))}</span>
                </span>
              </StyledMessage>
            )
          })
        }
      </StyledContent>
      <StyledInputContainer>
        <StyledInput
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeypress}
        />
        <StyledButton onClick={handleSubmit}>Submit</StyledButton>
      </StyledInputContainer>
    </StyledContainer>
  )
};

export default RoomHistory;
