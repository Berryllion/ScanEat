import { FormEvent, FunctionComponent, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';

import { ReduxState } from '../logic';
import { SET_AUTH_MODAL } from '../logic/actions/general';
import { login, register } from '../logic/api';
import { UserType } from '../logic/types';
import { bpdw, BreakpointSizes } from './breakpoints';
import { green, lightGreen, lightRed, red } from './colors';

import {
  BackdropContainer,
  ModalContainer,
  Title,
  BackButton,
  Choices
} from './modal';


const RegistrationRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  flex: 1;
  gap: 1rem;

  ${bpdw(BreakpointSizes.lg)} {
    flex-direction: column;
    justify-content: center;
  }
`;
const RegistrationChoice = styled.button<{isUser: boolean}>`
  cursor: pointer;
  margin: 0;
  padding: 0.2rem;
  padding: 0.5rem 2rem;
  border: 0;
  border-radius: .25rem;
  background-color: ${({ isUser }) => isUser ? green : red};

  font-family: "Segoe UI SemiBold";
  font-size: 1.2rem;
  text-align: center;
  color: #fff;

  transition: .2s;
  &:hover {
    background-color: ${({ isUser }) => isUser ? lightGreen : lightRed};
  }
`;
const LoginChoice = styled.p`
  cursor: pointer;
  text-align: center;
  font-family: "Segoe UI";
  font-size: 1rem;
  border-bottom: 2px solid #fff;
  transition: .2s;
  padding: 0.2rem;

  &:hover {
    border-bottom: 2px solid #303030;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 2rem;
  width: 100%;
  flex: 1;
`;
const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  width: 80%;

  label {
    flex: 1;
    text-align: right;
    font-family: "Segoe UI";
  }
`;
const Input = styled.input`
  background-color: white;
  padding: .5rem;
  border-radius: .5rem;
  color: black;
  border: 1px solid #CCC;
  font-family: "Segoe UI";
  flex: 3;
`;
const FormSubmit = styled.button`
  cursor: pointer;
  margin: 0;
  background-color: ${green};
  padding: 0.5rem 2rem;
  width: 50%;
  border: 0;
  border-radius: .25rem;
  margin-top: 2rem;

  font-family: "Segoe UI SemiBold";
  font-size: 1rem;
  text-align: center;
  color: #fff;

  transition: .2s;
  &:hover {
    background-color: ${lightGreen};
  }
`;
const Error = styled.p`
  color: ${red};
  font-family: "Segoe UI";
  font-size: 1rem;
  margin: 0;
`;

enum AuthContent {
  MENU = "MENU",
  LOGIN = "LOGIN",
  REGISTER_USER = "REGISTER_USER",
  REGISTER_PRO = "REGISTER_PRO",
}

const MenuContent: FunctionComponent<{setContent(v: AuthContent): void}> = ({ setContent }) => (
  <>
    <Title>
      Authentification
    </Title>
    <Choices>
      <RegistrationRow>
        <RegistrationChoice
          isUser={true}
          onClick={() => setContent(AuthContent.REGISTER_USER)}
        >
          Looking for a place to eat
        </RegistrationChoice>
        <RegistrationChoice
          isUser={false}
          onClick={() => setContent(AuthContent.REGISTER_PRO)}
        >
          Restaurant owner
        </RegistrationChoice>
      </RegistrationRow>
      <LoginChoice onClick={() => setContent(AuthContent.LOGIN)}>
        Already have an account?
      </LoginChoice>
    </Choices>
  </>
);
const LoginContent: FunctionComponent<{setContent(v: AuthContent): void}> = ({ setContent }) => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await login(dispatch, ws, {
      email,
      password,
    });
    if (response.success !== true) {
      setError(response.data);
    } else {
      setError('');
      setContent(AuthContent.MENU);
      dispatch({
        type: SET_AUTH_MODAL,
        payload: false,
      });
      if (response.data.type === UserType.PRO)
        Router.push('/manage');
    }
  };

  return (
    <>
      <BackButton onClick={() => setContent(AuthContent.MENU)}>
        <ArrowLeft />
      </BackButton>
      <Title>
        Login
      </Title>
      <Form onSubmit={onSubmit} noValidate>
        <InputRow>
          <label htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            required
          />
        </InputRow>
        <InputRow>
          <label htmlFor="password">
            Password
          </label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value) }
            required
          />
        </InputRow>
        <FormSubmit>
          Login
        </FormSubmit>
        {error && (
          <Error>
            {error}
          </Error>
        )}
      </Form>
    </>
  );
};
const RegisterContent: FunctionComponent<{setContent(v: AuthContent): void, type: string}> = ({ setContent, type }) => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await register(dispatch, ws, {
      email,
      password,
      firstname,
      lastname,
      type,
    });
    if (response.success !== true) {
      setError(response.data);
    } else {
      setError('');
      setContent(AuthContent.MENU);
      dispatch({
        type: SET_AUTH_MODAL,
        payload: false,
      });
      if (response.data.type === UserType.PRO)
        Router.push('/manage/settings');
    }
  };

  return (
    <>
      <BackButton onClick={() => setContent(AuthContent.MENU)}>
        <ArrowLeft />
      </BackButton>
      <Title>
      {type === "client" ? "User" : "Restaurant"} registration
      </Title>
      <Form onSubmit={onSubmit} noValidate>
      <InputRow>
          <label htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            required
          />
        </InputRow>
        <InputRow>
          <label htmlFor="firstname">
            Firstname
          </label>
          <Input
            type="firstname"
            name="firstname"
            id="firstname"
            placeholder={`Firstname ${type === 'client' ? '(Optional)' : ''}`}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value) }
            required
          />
        </InputRow>
        <InputRow>
          <label htmlFor="lastname">
            Lastname
          </label>
          <Input
            type="lastname"
            name="lastname"
            id="lastname"
            placeholder={`Lastname ${type === 'client' ? '(Optional)' : ''}`}
            value={lastname}
            onChange={(e) => setLastname(e.target.value) }
            required
          />
        </InputRow>
        <InputRow>
          <label htmlFor="password">
            Password
          </label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value) }
            required
          />
        </InputRow>
        <FormSubmit>
          Register
        </FormSubmit>
        {error && (
          <Error>
            {error}
          </Error>
        )}
      </Form>
    </>
  );
};


const AuthModal = () => {
  const dispatch = useDispatch();
  const authModal = useSelector((state: ReduxState) => state.authModal);
  const [content, setContent] = useState<AuthContent>(AuthContent.MENU);

  const quitModal = () => {
    dispatch({
      type: SET_AUTH_MODAL,
      payload: false
    });
  };

  return (
    <BackdropContainer show={authModal} onClick={quitModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {content === AuthContent.MENU && <MenuContent setContent={setContent} />}
        {content === AuthContent.LOGIN && <LoginContent setContent={setContent} />}
        {content === AuthContent.REGISTER_USER && <RegisterContent setContent={setContent} type="client" />}
        {content === AuthContent.REGISTER_PRO && <RegisterContent setContent={setContent} type="pro" />}
      </ModalContainer>
    </BackdropContainer>
  );
};

export default AuthModal;
