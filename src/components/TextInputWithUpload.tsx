import React from "react";
import styled from "styled-components";
import UploadFileButton from "./UploadFileButton";

type TextInputWithUploadProps = {
  inputLabel: string;
  uploadLabel: string;
  onChangeTextInput: (value: string) => void;
  val?: string;
};

function TextInputWithUpload({
  inputLabel,
  uploadLabel,
  val,
  onChangeTextInput
}: TextInputWithUploadProps) {
  return (
    <Container>
      <InputContainer>
        <Label>{inputLabel}</Label>
        <Input onChange={e => onChangeTextInput(e.target.value)} value={val} />
      </InputContainer>
      <UploadContainer>
        <Label>{uploadLabel}</Label>
        <UploadFileButton fileHandler={() => {}} workloadFileName={""} />
      </UploadContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const Label = styled.label`
  font-size: 17px;
  font-family: HurmeGeometricSans3;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
`;

const InputContainer = styled.div`
  margin: 10px 20px 10px 10px;
  display: flex;
  align-items: start;
  justify-content: flex-start;
`;

const UploadContainer = styled.div`
  margin: 10px 20px 10px 10px;
  display: flex;
`;

const Input = styled.input`
  margin-left: 42px;
`;

export default TextInputWithUpload;