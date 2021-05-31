import styled from 'styled-components';

import { cardShadow } from './colors';
import { bpdw, BreakpointSizes } from './breakpoints';

export const BackdropContainer = styled.div<{show: boolean}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;

  display: ${({show}) => show ? 'initial' : 'none'};
`;
export const ModalContainer = styled.div`
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  width: 50vw;
  min-height: 50vh;
  max-width: 600px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: ${cardShadow};
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  ${bpdw(BreakpointSizes.md)} {
    width: 90vw;
    height: 50vh;
  }
`;
export const Title = styled.h1`
  font-family: "Segoe UI Bold";
  text-align: center;
`;
export const BackButton = styled.button`
  border: 0;
  margin: 0;
  font-family: "Segoe UI";
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0 1rem 0 0;
  transition: .25s ease-out;

  &:hover {
    left: .75rem;
  }
`;
export const Choices = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;