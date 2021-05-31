import { FunctionComponent, useState } from "react";
import { Check, Edit2, Plus, X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import { green, lightGreen, red, orange } from "../../../components/colors";
import {
  CategoryContainer,
  CategoryDishItem,
  CategoryDishItemDescription,
  CategoryDishItemName,
  CategoryDishItemPrice,
  CategoryDishList,
  CategoryName,
  Content,
  DishList
} from "../../../components/restaurantView/content";

import { ReduxState } from "../../../logic";
import { createCategory, updateCategory, deleteCategory } from "../../../logic/api/category";
import { createDish, updateDish, deleteDish } from "../../../logic/api/dish";
import { Dish } from "../../../logic/types";
import { Category } from "../../../logic/types/Category";

const DishActionButtons = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  svg {
    cursor: pointer;
    height: 1.2rem;
  }
`;
const MenuInput = styled.input`
  margin: 0;
  margin-bottom: .5rem;
  border: 1px solid #CCC;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  outline: none;
  transition: .25s;
  color: #303030;
  width: 75%;

  &:focus {
    border: 1px solid #999;
  }
`;
const DishItemInput = styled(MenuInput)`
  font-size: 1.1rem;
  font-family: 'Segoe UI Bold';
`;
const DishItemPrice = styled(MenuInput)`
  font-weight: normal;
  font-size: 1rem;
  color: #000A;
  font-family: 'Segoe UI';
`;
const DescriptionItemInput = styled.textarea`
  margin: 0;
  margin-bottom: .5rem;
  border: 1px solid #CCC;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  outline: none;
  transition: .25s;
  color: #303030;
  width: 90%;

  &:focus {
    border: 1px solid #999;
  }
  font-family: "Segoe UI";
  font-weight: normal;
  font-size: 0.9rem;
  color: #000A;
`;
const NewDishButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #fff;
  width: 50%;
  background-color: ${green};
  font-family: "Segoe UI SemiBold";
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin: auto;
  margin-top: 1rem;
  cursor: pointer;
  transition: .25s;

  &:hover {
    background-color: ${lightGreen};
  }
`;
const CategoryInput = styled(MenuInput)`
  font-family: 'Segoe UI Bold';
  font-size: 1.75rem;
  margin: 0;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const MenuDish: FunctionComponent<{ dish: Dish, last: boolean }> = ({ dish, last }) => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(dish.name);
  const [description, setDescription] = useState(dish.description);
  const [image, _setImage] = useState(dish.image);
  const [price, setPrice] = useState(dish.price);

  const toggleEdit = async () => {
    if (edit)
      await updateDish(dispatch, ws, dish.id, {
        name,
        description,
        image,
        price,
      });
    setEdit(!edit);
  };

  const _deleteDish = async () => {
    await deleteDish(dispatch, ws, dish.id);
  };

  return (
    <CategoryDishItem count={0} last={last}>
      <DishActionButtons className="dish-actions">
        { !edit ? (
          <Edit2 onClick={toggleEdit} color={orange} />
        ) : (
          <Check onClick={toggleEdit} color="#81e02e" />
        )}
        <X onClick={_deleteDish} color={red} />
      </DishActionButtons>
      <div>
        { !edit ? (
          <>
            <CategoryDishItemName>
              {dish.name}
            </CategoryDishItemName>
            <CategoryDishItemDescription>
              {dish.description}
            </CategoryDishItemDescription>
            <CategoryDishItemPrice>
              €{dish.price.toFixed(2)}
            </CategoryDishItemPrice>
          </>
        ) : (
          <>
            <DishItemInput
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <DescriptionItemInput
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <DishItemPrice
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </>
        )}
      </div>
    </CategoryDishItem>
  );
}

const MenuCategory: FunctionComponent<{ category: Category }> = ({ category }) => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const myRestaurant = useSelector((state: ReduxState) => state.myRestaurant);
  const [name, setName] = useState(category.name);
  const [edit, setEdit] = useState(false);

  const toggleEdit = async () => {
    if (edit)
      await updateCategory(dispatch, ws, category.id, name);
    setEdit(!edit);
  };
  const addDish = async () => {
    if (myRestaurant)
      await createDish(dispatch, ws, myRestaurant.id, category.id);
  }
  const _deleteCategory = async () => {
    await deleteCategory(dispatch, ws, category.id);
  }

  return (
    <CategoryContainer>
      <DishActionButtons className="category-actions">
        { !edit ? (
          <Edit2 onClick={toggleEdit} color="#ffbe59" />
        ) : (
          <Check onClick={toggleEdit} color="#81e02e" />
        )}
        <X onClick={_deleteCategory} color={red} />
      </DishActionButtons>
      {!edit ? (
        <CategoryName>
          {category.name}
        </CategoryName>
      ) : (
        <CategoryInput
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <CategoryDishList>
        {category.dishes.map((dish, u, ar) => (
          <MenuDish key={u} dish={dish} last={u === ar.length - 1} />
        ))}
      </CategoryDishList>
      <NewDishButton onClick={addDish}>
        <Plus color="white" />
        New dish
      </NewDishButton>
    </CategoryContainer>
  );
}

const Menu = () => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const myRestaurant = useSelector((state: ReduxState) => state.myRestaurant);

  const addCategory = async () => {
    if (myRestaurant)
      await createCategory(dispatch, ws, myRestaurant.id);
  }

  return (
    <Content>
      <DishList>
        {myRestaurant?.categories.map((category, i) => (
          <MenuCategory key={i} category={category} />
        ))}
      </DishList>
      <NewDishButton onClick={addCategory} style={{ width: "40%" }}>
        <Plus color="white" />
        New category
      </NewDishButton>
    </Content>
  )
};

export default Menu;