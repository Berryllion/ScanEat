import { FormEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { updateMyRestaurant, createMyRestaurant } from '../../../logic/api/restaurant';
import { Restaurant } from '../../../logic/types';
import { ReduxState } from '../../../logic';

import { green, lightGreen } from '../../../components/colors';
import {
  BackdropContainer,
  ModalContainer,
} from '../../../components/modal';  

import DroppableMarkerMap from './DroppableMarkerMap';

const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 1rem;
  width: 100%;

  label {
    font-family: "Segoe UI SemiBold";
    font-size: 1rem;
    width: 25%;
  }
  button {
    cursor: pointer;
    margin: 0;
    background-color: ${green};
    padding: 0.5rem 2rem;
    width: 100%;
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
  }
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  width: 100%;
  
  input {
    font-family: "Segoe UI";
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #CCC;
    width: 75%;
    transition: .5s;
    outline: none;

    &:focus {
      border: 1px solid #999;
    }
  }
`;

const InputRow: FunctionComponent<{name: string, value: string, change(v: string): void}> = ({name, value, change}) => (
  <InputContainer>
    <label
      htmlFor={name}
    >
      {name}:&nbsp;
    </label>
    <input
      id={name}
      value={value}
      onChange={(e) => {
        change(e.target.value);
      }}
    />
  </InputContainer>
);

const EditModal: FunctionComponent<{ restaurant: Restaurant | null, showModal: boolean, quitModal(): void }> = ({ restaurant, showModal, quitModal }) => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);

  const isPageLoaded = useRef(true);

  const [name, setName] = useState(restaurant?.name || "");
  const [description, setDescription] = useState(restaurant?.description || "");
  const [image, setImage] = useState(restaurant?.image || "");
  const [city, setCity] = useState(restaurant?.city || "");
  const [pos, setPos] = useState({ latt: restaurant?.latt || 0, long: restaurant?.long || 0 });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (restaurant) {
      const res = await updateMyRestaurant(dispatch, ws, restaurant.id, {
        name,
        description,
        image,
        city,
        latt: pos.latt,
        long: pos.long,
      });
      if (res.success)
        quitModal();
    } else {
      const res = await createMyRestaurant(dispatch, ws, {
        name,
        description,
        image,
        city,
        latt: pos.latt,
        long: pos.long,
      });
      if (res.success)
        quitModal();
    }
  };

  const locationData = (pos: GeolocationPosition) => {
    if (isPageLoaded.current) {
      setPos({
        latt: pos.coords.latitude,
        long: pos.coords.longitude,
      });
    }
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      const result = await navigator.permissions.query({ name: "geolocation" });
      if (result.state === "granted")
        navigator.geolocation.getCurrentPosition(locationData);
      else if (result.state === "prompt")
        navigator.geolocation.getCurrentPosition(locationData, () => {}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    }
  };

  useEffect(() => {
    getLocation();
    return () => {
      isPageLoaded.current = false;
    };
  }, []);

  return (
    <BackdropContainer show={showModal} onClick={quitModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={onSubmit}>
          <InputRow
            name="Name"
            value={name}
            change={setName}
          />
          <InputRow
            name="Description"
            value={description}
            change={setDescription}
          />
          <InputRow
            name="Image (url)"
            value={image}
            change={setImage}
          />
          <InputRow
            name="City"
            value={city}
            change={setCity}
          />
          <br/>
          <label>Position:</label>
          <DroppableMarkerMap
            latt={pos.latt}
            long={pos.long}
            change={setPos}
          />
          <button type="submit">
            Save
          </button>
        </Form>
      </ModalContainer>
    </BackdropContainer>
  )
};

export default EditModal;
