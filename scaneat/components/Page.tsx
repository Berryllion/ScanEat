import Link from 'next/link';
import Router from 'next/router';

import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { LogIn, LogOut } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../logic';
import { RESET, SET_AUTH_MODAL } from '../logic/actions/general';
import AuthModal from './AuthModal';
import { UserType } from '../logic/types';

export const widthLimit = '1200px';

const Container = styled.div<{modalOpen: boolean}>`
  position: relative;
  min-height: 100%;
  width: 100%;

  ${({modalOpen}) => modalOpen && `
    overflow: hidden;
    height: 100vh;
  `}
`;

const HeaderContainer = styled.header<{transparentHeader?: boolean}>`
  z-index: 100;
  width: 100%;
  background-color: ${({transparentHeader}) => transparentHeader ? 'none' : 'white'};
  box-shadow: ${({transparentHeader}) => transparentHeader ? 'none' : '0 1px rgb(32 33 37 / 12%)'};
  height: 70px;
  padding: 0 2rem;
`;
const HeaderFlex = styled.div`
  margin: auto;
  max-width: ${widthLimit};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 15px;
`;
const Logo = styled.img<{transparentHeader?: boolean, isOnSite: boolean}>`
  height: 40px;
  filter: ${({transparentHeader}) => transparentHeader ? 'invert(1) brightness(10)' : 'invert(0)'};

  ${({isOnSite}) => !isOnSite && `
    cursor: pointer;
    transition: .25s;
    &:hover {
        transform: scale(1.1);
    }
  `}
`;
const LogInOutButton = styled.div<{transparentHeader?: boolean}>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({transparentHeader}) => transparentHeader ? '#fff' : '#303030'};

  svg {
    transition: .25s;
    /* filter: ${({transparentHeader}) => transparentHeader ? 'invert(0)' : 'invert(1)'}; */
    /* color: ${({transparentHeader}) => transparentHeader ? '#fff' : '#303030'}; */
  }
  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
`;

const Header: FunctionComponent<{transparentHeader?: boolean}> = ({ transparentHeader }): JSX.Element => {
  const dispatch = useDispatch();
  const onSite = useSelector((state: ReduxState) => state.onSite);
  const me = useSelector((state: ReduxState) => state.me);

  return (
    <HeaderContainer transparentHeader={transparentHeader}>
      <HeaderFlex>
        {onSite ? (
          <Logo src='/images/scaneat-grey.svg' transparentHeader={transparentHeader} isOnSite={onSite} />
        ) : (
          <Link href={me?.type === UserType.PRO ? '/manage' : '/'}>
            <Logo src='/images/scaneat-grey.svg' transparentHeader={transparentHeader} isOnSite={onSite} />
          </Link>
        )}
        {!onSite && me && (
          <LogInOutButton
            onClick={() => {
              dispatch({
                type: RESET
              });
              Router.push('/');
            }}
            transparentHeader={transparentHeader}
          >
            Log out
            <LogOut/>
          </LogInOutButton>
        )}
        {!onSite && !me && (
          <LogInOutButton
            onClick={() => {
              dispatch({
                type: SET_AUTH_MODAL,
                payload: true
              })
            }}
            transparentHeader={transparentHeader}
          >
            Login
            <LogIn/>
          </LogInOutButton>
        )}
      </HeaderFlex>
    </HeaderContainer>
  );
};

const Index: FunctionComponent<{transparentHeader?: boolean}> = ({ children, transparentHeader }): JSX.Element => {
  const authModal = useSelector((state: ReduxState) => state.authModal);

  return (
    <Container modalOpen={authModal}>
      <AuthModal />
      <Header transparentHeader={transparentHeader} />
      {children}
    </Container>
  )
}

export default Index;