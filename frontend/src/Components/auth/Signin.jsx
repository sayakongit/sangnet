
import { styled } from "styled-components";
import "./Signin.css";
import "./Login";
import "./Otp";
import {ContainerLeft} from "./ContainerLeft";
import { SignInContainerRight } from "./SignInContainerRight";

const Signin = () => {
  // this is used to navigate to different pages
  return (
    <div>
      <Wrapper>
        <ContainerLeft/>
        <SignInContainerRight/>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  margin: 0px;
  border: none;
  display: flex;
  flex-direction: row;
  height: 100vh;
  scroll-behavior: smooth;
`;

export default Signin;
