import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApplicationContext } from '../../providers/applicationProvider';
import { useGetProfessions } from '../../api/getProfessions';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100vh;
`;

const StyledContent = styled.div`
  padding: 24px;
  border: 1px solid #999;
  border-radius: 12px;
  max-height: 100vh;
  overflow: auto;
}
`;

const StyledProfile = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-right: 6px;
  margin-bottom: 12px;
  
  img {
    width: 100%;
    max-width: 200px;
  }
`;

const StyledDescriptionContainer = styled.div`
  margin-bottom: 12px;
`;

const StyledDescription = styled.div`

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .desc {
    font-style: italic;
  }
`;

const StyledTime = styled.div`
  color: #999;
  font-size: 6px;
  margin-top: 6px;
`;

const StyledAudio = styled.audio`
  width: 100%;
  margin-bottom: 12px;
`;

const ProfessionInfo = () => {
  const { token } = useApplicationContext()
  const { userId } = useParams();
  const [professionInfo, setProfessionInfo] = useState({});
  const { getProfessions } = useGetProfessions();

  const {
    id,
    name,
    age,
    distance,
    online,
    busy,
    lastActive,
    viewedCount,
    callCount,
    followersCount,
    gLevel,
    callable,
    interests = [],
    followed, 
    profilePicture,
    profilePictures = [],
    voice,
  } = professionInfo;

  useEffect(() => {
    if (userId && token) {
      getProfessions({ userId, token })
        .then(setProfessionInfo);
    }
  }, [token, userId]);

  return (
    <StyledContainer>
      <StyledContent>
        <StyledProfile>
          <StyledImageContainer>
            <img alt="profile" src={profilePicture?.url} />
          </StyledImageContainer>
          <StyledDescriptionContainer>
            <StyledDescription>{`id: ${id}`}</StyledDescription>
            <StyledDescription>
              <span className="title">{`${name}, ${age}`}</span>
            </StyledDescription>
            <StyledDescription>
              <span className="title">{`${Number(distance).toFixed(2)}km, gLevel: ${gLevel}`}</span>
            </StyledDescription>
            <StyledDescription>
              {
                interests.map((interest) => (
                  <span key={interest.title} className="desc">{interest?.title}</span>
                ))
              }
            </StyledDescription>
            <StyledDescription>
              <span>{`call: ${callCount}, view: ${viewedCount}, follow: ${followersCount}`}</span>
            </StyledDescription>
            <StyledDescription>
              lastActive:
              {lastActive && (<StyledTime>{new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Taipei' }).format(new Date(lastActive))}</StyledTime>)}
            </StyledDescription>
            <StyledDescription>
              <span>{`followed: ${followed ? '🟢' : '❌'}`}</span>
            </StyledDescription>
            <StyledDescription>
              <span>{`online: ${online ? '🟢' : '⚪️'}`}</span>
            </StyledDescription>
            <StyledDescription>
              <span>{`busy: ${busy ? '🔴' : '⚪️'}`}</span>
            </StyledDescription>
            <StyledDescription>
              <span>{`callable: ${callable ? '🟢' : '🔴'}`}</span>
            </StyledDescription>
          </StyledDescriptionContainer>
        </StyledProfile>
        {
          voice?.asset?.url && (
            <StyledAudio controls muted>
              <source preload="auto" type="audio/mpeg" src={voice.asset.url} />
            </StyledAudio>
          )
        }
        {
          profilePictures.map((image) => (
            <StyledImageContainer key={image?.url}>
              <img alt="profile" src={image?.url} />
            </StyledImageContainer>
          ))
        }
        {JSON.stringify(professionInfo, null, 4)}
      </StyledContent>
    </StyledContainer>
  )

};

export default ProfessionInfo;
