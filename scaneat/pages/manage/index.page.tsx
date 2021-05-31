import Link from 'next/link';
import { Edit2 } from 'react-feather';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { green, lightGreen, lightRed, red } from '../../components/colors';
import Page, { widthLimit } from '../../components/Page';
import { ReduxState } from '../../logic';
import Orders from './orders';

const Container = styled.div`
  min-height: calc(90vh - 70px);
  width: 100%;
  max-width: ${widthLimit};
  box-sizing: border-box;
  margin: auto;
  margin-top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CreatingRestaurantButton = styled.div`
  color: white;
  background-color: ${red};
  font-family: "Segoe UI SemiBold";
  text-align: center;
  padding: .5rem 1rem;
  border-radius: .5rem;
  cursor: pointer;

  a {
    font-size: 1.25rem;
    color: white;
    text-decoration-line: none;
  }

  &:hover {
    background-color: ${lightRed};
  }
`;
const EditRestaurantButton = styled.div`
  margin-top: -3rem;
  color: white;
  align-self: flex-end;
  background-color: ${green};
  font-family: "Segoe UI SemiBold";
  text-align: center;
  padding: .5rem 1rem;
  border-radius: .5rem;
  cursor: pointer;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    a {
      font-size: 1.25rem;
      color: white;
      text-decoration-line: none;
    }
  }

  &:hover {
    background-color: ${lightGreen};
  }
`;


const ManageIndex = () => {
  const myRestaurant = useSelector((state: ReduxState) => state.myRestaurant);

  return (
    <Page>
      <Container>
        {myRestaurant !== null ? (
          <>
            <EditRestaurantButton>
              <Link href='/manage/settings'>
                <div>
                  Settings
                  <Edit2 color="white" />
                </div>
              </Link>
            </EditRestaurantButton>
            <h1>Dashboard - {myRestaurant.name}</h1>
            <Orders />
          </>
        ) : (
          <CreatingRestaurantButton>
            <Link href='/manage/settings'>
              Go to restaurant creation
            </Link>
          </CreatingRestaurantButton>
        )}
      </Container>
    </Page>
  )
};

export default ManageIndex;