import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 24px;
  box-shadow: 2px 2px 5px rgb(0 0 0 / 20%);
  cursor: pointer;
`;

const StyledTitle = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
`;

const StyledPreview = styled.div`
  font-size: 12px;
`;

const Room = ({
  className,
  room,
}) => {
  const { id: roomId } = room
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/room/histories/${roomId}`);
  };

  return (
    <StyledContainer className={className} onClick={handleClick}>
      <StyledTitle>{room?.other?.name}</StyledTitle>
      <StyledPreview>{room?.detail}</StyledPreview>
    </StyledContainer>
  )
};

export default Room;