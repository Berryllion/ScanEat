import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';

import { ReduxState } from "../../../logic";
import Page, { widthLimit } from '../../../components/Page';
import { bpdw, BreakpointSizes } from "../../../components/breakpoints";
import { DEL_RESTAURANT } from "../../../logic/actions/restaurant";
import { SET_ON_SITE, SET_TABLE } from "../../../logic/actions/general";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${widthLimit};
  margin: auto;
  box-sizing: border-box;
  padding: 2rem;
`;
const Title = styled.div`
  height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  h1 {
    font-family: 'Segoe UI';
    font-weight: 100;
    font-size: 3rem;
    margin: 0;
  }
  p {
    font-family: 'Fredoka One';
    font-size: 3rem;
    margin: 0;
  }
  ${bpdw(BreakpointSizes.md)} {
    height: 50vh;
  }
`;

const Index = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const restaurant = useSelector((state: ReduxState) => state.watchingRestaurant);
  const id = router.query.id as string;

  const goBack = async () => {
    dispatch({
      type: SET_ON_SITE,
      payload: false
    });
    dispatch({
      type: SET_TABLE,
      payload: null,
    });
    router.replace(`/restaurant/${id}`);
  }

  useEffect(() => {
    console.log(id, restaurant);
    if (id && (!restaurant || restaurant.id.toString() !== id))
      goBack();
  }, [id]);

  useEffect(() => {
    dispatch({
      type: SET_ON_SITE,
      payload: false
    });
    dispatch({
      type: SET_TABLE,
      payload: null,
    })
    return () => {
      dispatch({
        type: DEL_RESTAURANT
      });
    }
  }, []);

  return (
    <Page>
      <Container>
        <Title>
          <h1>
            Thank you for eating at
          </h1>
          <p>
            {restaurant?.name || (<>&nbsp;</>)}
          </p>
        </Title>
      </Container>
    </Page>
  );
}

export default Index;