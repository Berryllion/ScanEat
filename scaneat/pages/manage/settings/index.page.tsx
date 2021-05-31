import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Page from '../../../components/Page';
import Hero from '../../../components/restaurantView/hero';
import {
  TopOrder,
} from '../../../components/restaurantView/content';
import { ReduxState } from '../../../logic';
import EditModal from './EditModal';
import Menu from './Menu';
import RestaurantPositionMap from '../../restaurant/[id]/components/RestaurantPositionMap';


const Container = styled.div`
  min-height: calc(90vh - 70px);
  margin-top: 10vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ManageIndex = () => {
  const myRestaurant = useSelector((state: ReduxState) => state.myRestaurant);

  const [editModal, setEditModal] = useState(false);

  return (
    <Page transparentHeader>
      <Container>
        <Hero restaurant={myRestaurant} editable openEdit={() => setEditModal(true)} />
        <TopOrder isMap={true}>
          <RestaurantPositionMap
            latt={myRestaurant?.latt || 0}
            long={myRestaurant?.long || 0}          
          />
        </TopOrder>
        <Menu />
      </Container>
      <EditModal restaurant={myRestaurant} showModal={editModal} quitModal={() => setEditModal(false)} />
    </Page>
  );
};

export default ManageIndex;