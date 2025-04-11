import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
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
  cursor: pointer;
`;

const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledImageContainer = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 6px;
  
  img {
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
    height: 100%;
  }
`;

const StyledTitle = styled.div`
  font-size: 14px;
  font-weight: bold;

  span.id {
    color: #999;
    font-size: 6px;
    margin-top: 6px;
  }
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
  -webkit-overflow-scrolling: touch;
}
`;

const StyledLoadMore = styled.div`
  width: 100%;
  height: 48px;
  border: 1px solid;
  line-height: 48px;
  display: flex;
  justify-content: center;
`;

const StyledMessage = styled.div`
  color: ${({ isMe }) => (isMe ? 'blue' : 'crimson')};
  text-align: ${({ isMe }) => (isMe ? 'right' : 'left')};
  margin-top: 12px;

  .text {
    display: inline-flex;
    flex-direction: column;
    overflow-wrap: break-word;
    text-align: left;
    max-width: 90%;
    color: ${({ roomType }) => {
      if (roomType === 5) return 'green';
      if (roomType === 3) return 'purple';
      return 'unset';
    }};
    padding: 12px;
    border: 1px solid #999;
    border-radius: 12px;

    img.sticker {
      width: 50px;
      border: 1px solid #eee;
      border-radius: 6px;
    }

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

const defaultPage = {
  limit: 50,
  offset: 0,
};

const RoomHistory = () => {
  const { roomId } = useParams();
  const { token, deviceConfig } = useApplicationContext();
  const [info, setInfo] = useState({});
  const [histories, setHistories] = useState([]);
  const [professionInfo, setProfessionInfo] = useState({});
  const [page, setPage] = useState(defaultPage);
  const [value, setValue] = useState('');

  const navigate = useNavigate();

  const userId = info?.other?.id;
  const clearPicture = info?.other?.clearPicture;
  const { lastActive, online, busy, callable, distance } = professionInfo;

  const { getRoomHistories } = useGetRoomHistories();
  const { postRoomMessage } = usePostRoomMessage();
  const { getProfessions } = useGetProfessions();

  const handleGetRoomHistories = ({ page }) => {
    const { limit, offset } = page;
    getRoomHistories({ token, roomId, deviceConfig, offset, limit })
      .then((data) => {
        const { me, other, histories = [] } = data
        setInfo({ me, other })
        if (page.offset === 0) {
          setHistories(histories);
        } else {
          setHistories((prev) => [...histories, ...prev]);
        }
      });
  };

  const handleLoadMore = () => {
    setPage((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
  }

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleRefresh = () => {
    setPage(defaultPage)
    handleGetRoomHistories({ page: defaultPage });
  }

  const handleSubmit = () => {
    postRoomMessage({ message: value, token, roomId })
      .then(() => {
        setValue('');
        setPage(defaultPage)
        handleGetRoomHistories({ page: defaultPage });
      });
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      handleSubmit();
    }
  };

  const handleProfileClick = () => {
    navigate(`/profession/${userId}`);
  }

  useEffect(() => {
    if (roomId && token) { handleGetRoomHistories({ page });
    }
  }, [token, roomId, page.offset]);

  useEffect(() => {
    if (userId && token) {
      getProfessions({ userId, token })
        .then(setProfessionInfo);
    }
  }, [token, userId]);

  const { me, other: user } = info;

  return (
    <StyledContainer>
      <StyledTopContainer>
        <StyledProfile onClick={handleProfileClick}>
          <StyledImageContainer>
            <img src={clearPicture?.url} />
          </StyledImageContainer>
          <StyledTitleContainer>
            <StyledTitle>
              {user?.name}
              <span className="id">{`(${userId})`}</span>
            </StyledTitle>
            {lastActive && (<StyledTime>{new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Taipei' }).format(new Date(lastActive))}</StyledTime>)}
            <StyledTime>online: {online ? '🟢' : '⚪️'}, busy: {busy ? '🔴' : '⚪️'}, callable: {callable ? '🟢' : '🔴' }, {Number(distance).toFixed(3)}km</StyledTime>
            <StyledTime>
            </StyledTime>
          </StyledTitleContainer>
        </StyledProfile>
        <StyledButton onClick={handleRefresh}>Refresh</StyledButton>
      </StyledTopContainer>
      <StyledContent>
        <StyledLoadMore onClick={handleLoadMore}>Load More</StyledLoadMore>
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
                  { history?.roomType === 6 && (
                    <img
                      className="sticker"
                      alt={history?.gift?.name || 'sticker'}
                      src={history?.gift?.image}
                    />
                  ) }
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
