import React from 'react'
import { styled } from "styled-components";

const ContainerLeft = () => {
  return (
    <SectionL><h1 className="logo-h1"> Sangnet </h1>
    <p>"Connecting Lives, Saving Futures."</p></SectionL>
  )
}


const SectionL = styled.div`
  background: #40339f;
  color: White;
  border: 2px solid #40339f;
  width: 35vw;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    color: #ffffffca;
  }
`;
export  {ContainerLeft}