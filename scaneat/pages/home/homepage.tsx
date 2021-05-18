
import { NextPage } from 'next';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.primary};
  clip-path: url(#wave);
`

const Title = styled.h1`
  color: black;
`

const Test = styled.div`
`
const HomePage: NextPage = (): JSX.Element => (
  <Container>
    <img src='/images/scaneat.svg' />
    <Title>
      The solution<br />
      for restaurants<br />
      and gastronomic.<br />
    </Title>
    <svg>
      <defs>
        <clipPath id="wave" clipPathUnits="objectBoundingBox">
          <path className="st0" d="
            M 0.0 0.0
            L 0.0 0.9
            S 0.2 0.7   0.43 0.8
            S 0.8 0.9   1.0 0.8
            L 1.0 0.0
            Z"
          />
        {/* <path className="st0" d="M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z"/> */}
          {/* <path className="st0" d="M 1 295 H 2 l 0.00372 0.76796 c 0 0 -0.110785 0.13792 -0.299135 0.17878 c -0.162554 0.0353 -0.383584 -0.0167 -0.462653 -0.0241 C 1.07125 295.907 1 296 1 296 Z"/> */}
        </clipPath>
      </defs>
    </svg>
    {/* <svg viewbox="0 0 100 25">
      <path fill="#9EAFFD" opacity="0.5" d="M0 30 V15 Q30 3 60 15 V30z" />
      <path fill="#9EAFFD" d="M0 30 V12 Q30 17 55 12 T100 11 V30z" />
    </svg> */}
  </Container>
);

export default HomePage;
