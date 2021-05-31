import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { bpdw, BreakpointSizes } from '../breakpoints';
import { widthLimit } from '../Page';
import { Restaurant } from '../../logic/types';
import { Edit } from 'react-feather';

const HeroContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 30rem;
  padding-bottom: 1.5rem;
  justify-content: flex-end;
`;
const HeroContainerImg = styled.div`
  background-color: #333;
  position: absolute;
  overflow: hidden;
  top: -70%;
  right: 0;
  bottom: 0;
  left: 0;
  height: 170%;
  z-index: -1;

  img {
    position: absolute;
    transform: translate(-50%, 0px);
    top: 0;
    left: 50%;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    object-fit: cover;
    filter: brightness(0.9);
  }
`;
const SizeLimitter = styled.div`
  width: 100%;
  max-width: ${widthLimit};
  overflow: hidden;
  margin: 0 auto 2rem auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;
const HeroTitle = styled.div`
  color: white;
  h1 {
    margin: 0;
    font-size: 5rem;
    font-weight: 100;
    font-family: 'Fredoka One';
    ${bpdw(BreakpointSizes.md)} {
      font-size: 4rem;
    }
  }
  p {
    margin: 0;
    font-size: 2rem;
    font-weight: normal;
    font-family: 'Segoe UI';
    ${bpdw(BreakpointSizes.md)} {
      font-size: 1.5rem;
    }
  }
`;

const TitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;

  svg {
    cursor: pointer;
  }
`;

const Hero: FunctionComponent<{restaurant: Restaurant | null, editable?: boolean, openEdit?: () => void }> = ({ restaurant, editable, openEdit }) => (
  <HeroContainer>
    <HeroContainerImg>
      <img src={restaurant?.image} />
    </HeroContainerImg>
    <SizeLimitter>
      <HeroTitle>
        <TitleDiv>
          <h1>
            {restaurant?.name || "N/A"}
          </h1>
          {editable && (
            <Edit onClick={openEdit} />
          )}
        </TitleDiv>
        <p>
          {restaurant?.description}
        </p>
      </HeroTitle>
    </SizeLimitter>
  </HeroContainer>
);

export default Hero;