import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from "formik";

import Colors from "../../constants/Colors";
import CvsuDroneShot from "../../assets/cvsu_logo/cvsu_droneShot.jpg";
import CvsuLogo from "../../assets/cvsu_logo/cvsu_logo.png";
import Button from "../../components/Button";
import { ErrorMessages } from "../../constants/Strings";
import { LoginDTO, SendResetPasswordLink } from "../../lib/user.hooks";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { User } from "../../types/User";
import { UserContext } from "../../App";

type LoginScreenProps = {
  onLoginButtonClick?: () => void;
  onRegisterButtonClick?: () => void;
  UseLogin: (values: LoginDTO) => void;
  user?: User;
};

type LoginFormValueType = {
  username: string;
  password: string;
};

const initialFormValues: LoginFormValueType = {
  username: "",
  password: ""
};

const LoginFormSchema = Yup.object().shape({
  username: Yup.string().trim().required(ErrorMessages.REQUIRED),
  password: Yup.string().trim().required(ErrorMessages.REQUIRED)
});

export default function LoginScreen({
  onLoginButtonClick,
  onRegisterButtonClick,
  UseLogin,
  user
}: LoginScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isDesktopTablet = window.innerWidth > 1201;

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [successResetSendMessage, setSuccessResetSendMessage] = useState("");

  const { loginError } = useContext(UserContext);

  const onSubmit = async (values: LoginDTO) => {
    setIsSubmitting(true);
    UseLogin(values);
  };

  useEffect(() => {
    if (loginError) {
      setIsSubmitting(false);
    }
  }, [loginError]);

  const onSendResetPasswordLink = async () => {
    setIsSubmitting(true);
    setSuccessResetSendMessage("");
    setErrorMessage("");
    try {
      await SendResetPasswordLink(email);
      setEmail("");
      setSuccessResetSendMessage("A reset link was sent to your email.");
    } catch (e) {
      setErrorMessage("Email not registered.");
      console.log(e);
    }
    setIsSubmitting(false);
  };

  return (
    <Container width={width} height={height} isDesktopTablet={isDesktopTablet}>
      <Header>
        <CvsuDroneShotImg src={CvsuDroneShot} />
        <CvsuLogoImg src={CvsuLogo} />
      </Header>
      <FormContainer>
        {isForgotPassword ? (
          <SendEmailContainer>
            <FieldGroup style={{ marginBottom: 20 }}>
              <Label>Email</Label>
              <FieldIconContainer>
                <TextInput
                  type={"email"}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FieldIconContainer>
              {errorMessage && (
                <ErrorMessageContainer
                  style={{
                    marginLeft: 0
                  }}
                >
                  <ErrorMessageText>{errorMessage}</ErrorMessageText>
                </ErrorMessageContainer>
              )}
              {successResetSendMessage && (
                <ErrorMessageContainer
                  style={{
                    marginLeft: 0
                  }}
                >
                  <ErrorMessageText style={{ color: "green" }}>
                    {successResetSendMessage}
                  </ErrorMessageText>
                </ErrorMessageContainer>
              )}
            </FieldGroup>
            <Button
              type="button"
              text="Send Reset Link"
              color={Colors.buttonPrimary}
              onClick={onSendResetPasswordLink}
              isSubmitting={isSubmitting}
              disable={!email || !email.includes("@cvsu.edu.ph")}
              hoverOpacity={
                !email || !email.includes("@cvsu.edu.ph") ? ".5" : undefined
              }
            />
            <Button
              type="button"
              text="Back"
              color={Colors.buttonSecondary}
              onClick={() => setIsForgotPassword(false)}
            />
          </SendEmailContainer>
        ) : (
          <Formik
            initialValues={initialFormValues}
            validationSchema={LoginFormSchema}
            onSubmit={onSubmit}
          >
            {({ values, errors, handleSubmit, touched, handleChange }) => (
              <FormStyled>
                <FieldGroup>
                  <Label>Username/Email</Label>
                  <FieldIconContainer>
                    <TextInput
                      type="text"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      className={
                        touched.username && errors.username ? "is-invalid" : ""
                      }
                    />
                    <AiFillEye size={20} opacity={0} />
                  </FieldIconContainer>
                  <ErrorMessageStyle
                    component="div"
                    name="username"
                    className="invalid-feedback"
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label>Password</Label>
                  <FieldIconContainer>
                    <TextInput
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className={
                        touched.password && errors.password ? "is-invalid" : ""
                      }
                    />
                    {showPassword ? (
                      <AiFillEye
                        size={20}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <AiFillEyeInvisible
                        size={20}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </FieldIconContainer>
                  <ErrorMessageStyle
                    component="div"
                    name="password"
                    className="invalid-feedback"
                  />
                </FieldGroup>
                {loginError && (
                  <ErrorMessageContainer>
                    <ErrorMessageText>{loginError}</ErrorMessageText>
                  </ErrorMessageContainer>
                )}
                <ForgotPasswordContainer
                  onClick={() => setIsForgotPassword(true)}
                >
                  <ForgotPasswordText>Forgot Password</ForgotPasswordText>
                </ForgotPasswordContainer>
                <ButtonsContainer>
                  <Button
                    type="submit"
                    text="Log In"
                    color={Colors.buttonPrimary}
                    onClick={() => handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                  <Button
                    type="button"
                    text="Register"
                    color={Colors.buttonSecondary}
                    onClick={onRegisterButtonClick}
                  />
                </ButtonsContainer>
              </FormStyled>
            )}
          </Formik>
        )}
      </FormContainer>
    </Container>
  );
}

const Container = styled.div<{
  width: number;
  height: number;
  isDesktopTablet: boolean;
}>`
  border: 1px solid ${Colors.black};
  margin: 100px 0px 100px 0px;
  width: ${p => (p.isDesktopTablet ? p.width / 3 + "px" : 80 + "%")};
  height: auto;
  align-self: center;
  border-radius: 15px;
`;

const Header = styled.div`
  flex-direction: column;
  display: flex;
`;

const CvsuDroneShotImg = styled.img`
  width: 100%;
  border-radius: 14px 14px 0px 0px;
  height: 130px;
`;

const CvsuLogoImg = styled.img`
  width: 100px;
  height: 85px;
  position: absolute;
  align-self: center;
  margin-top: 75px;
`;

const FormContainer = styled.div`
  margin-top: 60px;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const ForgotPasswordContainer = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 15px 0px 20px 0px;
`;

const ForgotPasswordText = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: HurmeGeometricSans3SemiBold;
  text-decoration-line: underline;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 0.6;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 30px 0px;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ErrorMessageStyle = styled(ErrorMessage)`
  font-size: 15px;
  font-family: HurmeGeometricSans3SemiBold;
  align-self: flex-start;
  font-weight: 400;
  color: red;
`;

const TextInput = styled.input`
  width: 100%;
  background-color: ${Colors.textFieldBackground};
  font-family: HurmeGeometricSans3;
  ::-ms-reveal {
    display: none;
  }
  border: none;
  outline: none;
  font-family: HurmeGeometricSans3;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;

const Label = styled.label`
  font-size: 15px;
  font-family: HurmeGeometricSans3;
  align-self: flex-start;
  font-weight: 400;
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  align-self: flex-start;
  margin: 10px 0px 0px 17px;
`;

const ErrorMessageText = styled.span`
  font-size: 15px;
  font-family: HurmeGeometricSans3SemiBold;
  align-self: flex-start;
  font-weight: 400;
  color: red;
`;

const FieldIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ececec;
  padding: 0 5px 0 5px;
`;

const SendEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
