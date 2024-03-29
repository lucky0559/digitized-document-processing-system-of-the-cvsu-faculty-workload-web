import styled from "styled-components";
import UploadFileButton from "./UploadFileButton";

type TextInputWithUploadProps = {
  inputLabel: string;
  uploadLabel?: string;
  onChangeTextInput: (value: string) => void;
  val?: string;
  onFileSelect: (file?: File) => void;
  fileName?: string;
  onRemoveFile?: () => void;
};

function TextInputWithUpload({
  inputLabel,
  uploadLabel,
  val,
  onChangeTextInput,
  onFileSelect,
  fileName,
  onRemoveFile
}: TextInputWithUploadProps) {
  return (
    <Container>
      <InputContainer>
        <Label>{inputLabel}</Label>
        <Input onChange={e => onChangeTextInput(e.target.value)} value={val} />
      </InputContainer>
      <UploadContainer>
        <Label>{uploadLabel}</Label>
        <UploadFileButton
          fileHandler={onFileSelect}
          workloadFileName={fileName}
          onRemoveFile={onRemoveFile}
        />
      </UploadContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  padding-top: 30px;
  margin-left: 35px;
`;

const Label = styled.label`
  font-size: 17px;
  font-family: HurmeGeometricSans3;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  max-width: 260px;
`;

const InputContainer = styled.div`
  margin: 10px 20px 10px 10px;
  display: flex;
  align-items: start;
  justify-content: flex-start;
  width: 50%;
`;

const UploadContainer = styled.div`
  margin: 10px 20px 10px 10px;
  display: flex;
`;

const Input = styled.input`
  margin-left: 42px;
  width: 100%;
  border: 1px solid black;
`;

export default TextInputWithUpload;
