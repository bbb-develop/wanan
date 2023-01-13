import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div``;

const Page = ({ children }) => {
  return (
    <StyledContainer>
      {children}
    </StyledContainer>
  );
};

export default Page;