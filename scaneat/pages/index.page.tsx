import { FunctionComponent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Restaurant } from '../logic/types';
import { getRestaurants } from '../logic/api/restaurant';
import { ReduxState } from '../logic';

import Page, { widthLimit } from '../components/Page';
import { bpdw, BreakpointSizes } from '../components/breakpoints';

const Container = styled.div`
  min-height: calc(90vh - 70px);
  width: 100%;
  max-width: ${widthLimit};
  box-sizing: border-box;
  margin: auto;
  margin-top: 10vh;
`
const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  gap: 1rem;
  margin: 2rem;
  ${bpdw(BreakpointSizes.lg)} {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }
  ${bpdw(BreakpointSizes.md)} {
    grid-template-columns: repeat(1, minmax(0px, 1fr));
  }
`;
const RestaurantCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: rgb(0 0 0 / 6%) 0px 0px 0.10rem 0px, rgb(0 0 0 / 12%) 0px 0.10rem 0.10rem 0px;
  cursor: pointer;

  &:hover {
    .restaurantimg {
      transform: scale(1.01);
    }
  }
`;
const RestaurantImgContainer = styled.div`
  overflow: hidden;
`

const RestaurantImg = styled.div<{imgUrl: string}>`
  padding: 25%;
  width: 100%;
  overflow: hidden;
  background-image: url(${({imgUrl}) => imgUrl});
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease-in-out 0s;
`;
const RestaurantInfosContainer = styled.div`
  padding: 1rem;
`;
const RestaurantName = styled.h3`
  margin: 0;
`;
const RestaurantDescription = styled.p`
  font-size: 0.8rem;
  margin-top: 0.2rem;
  color: #222A;
  margin: 0;
`;
const Title = styled.h1`
  font-family: "Fredoka One";
  font-weight: lighter;
  margin: 2rem;
`;

// TODO: Search
const _searchTypes: Record<string, any> = {
  'near': 'Restaurants near me',
  'green': 'Top green restaurants',
  'wanted': 'Most wanted restaurants',
}

const RestaurantCard: FunctionComponent<{restaurant: Restaurant}> = ({ restaurant }) => (
  <Link href={`/restaurant/${restaurant.id}`}>
    <RestaurantCardContainer>
      <RestaurantImgContainer>
        <RestaurantImg imgUrl={restaurant.image} className="restaurantimg" />
      </RestaurantImgContainer>
      <RestaurantInfosContainer>
      <RestaurantName>
        {restaurant.name}
      </RestaurantName>
      <RestaurantDescription>
        {restaurant.description}
      </RestaurantDescription>
      </RestaurantInfosContainer>
    </RestaurantCardContainer>
  </Link>
);

const Index = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const sort = (router.query['sort'] as string) || 'near';
  const [restaurants, setRestaurants] = useState<Array<Restaurant>>([]);

  const loadRestaurants = async () => {
    const {success, data} = await getRestaurants(dispatch, ws, { sort });
    if (success) {
      setRestaurants(data);
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  return (
    <Page>
      <Container>
        {/* <Link href="/list?sort=near">
          Restaurants near me
        </Link>
        <br/>
        <Link href="/list?sort=green">
          Top green restaurants
        </Link>
        <br/>
        <Link href="/list?sort=wanted">
          Most wanted *
        </Link> */}
        <Title>
          Restaurants on ScanEat
        </Title>
        <RestaurantGrid>
          {restaurants.map((restaurant, i) => (
            <RestaurantCard restaurant={restaurant} key={i}>
            </RestaurantCard>
          ))}
        </RestaurantGrid>
      </Container>
    </Page>
  );
};

export default Index;
