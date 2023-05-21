import styled, { css } from 'styled-components';

interface ModalBackgroundProps {
  isModalActive: boolean;
}

export const ModalBackground = styled.div<ModalBackgroundProps>`
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(5px);
  background-color: rgba(56, 56, 56, 0.4);
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  ${({ isModalActive }) => (isModalActive
        ? css`
      opacity: 1;
      pointer-events: all;
    `
        : css`
        opacity: 0;
        pointer-events: none;
      `)
}
`;

export const ModalWindow = styled.div<ModalBackgroundProps>`
  padding: 30px;
  border-radius: 12px;
  width: 40%;
  //max-width: 60%;
  background-color: #ffffff;
  ${({isModalActive}) => (isModalActive
          ? css`
            transform: scale(1);
          `
          : css`
            transform: scale(0.5);
          `)
  }
  transition: 0.4s all;
`;
