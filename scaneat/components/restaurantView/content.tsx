import styled from 'styled-components';

import { widthLimit } from "../Page";

import { green } from "../colors";
import { bpdw, BreakpointSizes } from "../breakpoints";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${widthLimit};
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-bottom: 2rem;
`;
export const DishList = styled.div`
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  width: 50%;
  ${bpdw(BreakpointSizes.md)} {
    width: 100%;
  }
`;

export const CategoryContainer = styled.div`
  margin: 2rem 0;
  position: relative;

  .category-actions {
    opacity: 0;
    transition: .25s;
  }
  &:hover {
    .category-actions {
      opacity: 1;
    }
  }

`;
export const CategoryName = styled.h2`
  font-family: 'Segoe UI Bold';
  font-size: 1.75rem;
  margin: 0;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;
export const CategoryDishList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
`;
export const CategoryDishItem = styled.div<{count: number, last?: boolean}>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid white;
  border-top: 1px solid #e4e4e4;
  ${({last}) => last && `
    border-bottom: 1px solid #e4e4e4;
  `}
  border-radius: 0.5rem;
  padding: 1.5rem 1rem;
  overflow: hidden;

  transition: 250ms;

  .dish-actions {
    opacity: 0;
    transition: .25s;
  }

  &:hover {
    border: 1px solid #e4e4e4;
    
    .dish-actions {
      opacity: 1;
    }
  }

  ${({count}) => `
    &:before {
      content: "";
      transition: .2s;
      border: 2px solid ${green};
      position: absolute;
      top: 10%;
      bottom: 10%;
      left: ${count > 0 ? 0 : -4}px;
      border-radius: 2px;
    }
  `}
`;
export const CategoryDishItemName = styled.p`
  margin: 0;
  margin-bottom: .25rem;
  font-size: 1.1rem;
  font-family: 'Segoe UI Bold';
`;
export const CategoryDishItemDescription = styled.p`
  margin: 0;
  margin-bottom: .5rem;
  font-weight: normal;
  font-size: 0.9rem;
  color: #000A;
`;
export const CategoryDishItemPrice = styled.p`
  margin: 0;
  font-weight: normal;
  font-size: 1rem;
  color: #000A;
  font-family: 'Segoe UI';
`;
export const AddRemoveContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: .75rem;
  font-size: 1rem;
`;
export const AddRemoveButton = styled.button`
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1rem;
  font-weight: normal;
  margin: 0;
  transition: .25s;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;

  &:hover {
    transform: scale(1.20);
  }
`;
export const TopOrder = styled.div<{isMap: boolean}>`
  max-width: ${widthLimit};
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: auto;
  top: 0;
  box-sizing: border-box;
  height: 115px;
  padding: 2rem;
  z-index: 1000;
  ${({ isMap }) => isMap ? `
    position: initial;
    ${bpdw(BreakpointSizes.md)} {
      justify-content: center;
      height: 120vw;
      max-height: 550px;
    }
  ` : `
    position: sticky;
  `}
`;