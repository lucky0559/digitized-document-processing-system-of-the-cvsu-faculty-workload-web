import styled from "styled-components";
import Dropdown from "../../../components/Dropdown";
import Colors from "../../../constants/Colors";
import { DROPDOWN_LISTS } from "../../../constants/Strings";
import UploadFileButton from "../../../components/UploadFileButton";

type ResearchWorkload1Props = {
  typeOfStudyHandler: (value: string) => void;
  designationStudyHandler: (value?: string) => void;
  rwlFileHandler: (value?: File) => void;
  typeOfStudy?: string;
  designationStudy?: string;
  rwlFileName?: string;
  points: number;
  studyPoints: number;
  onRemoveRwlFile: () => void;
  titleOfStudy: string;
  titleOfStudyHandler: (val: string) => void;
  addStudyHandler: () => void;
  isSaved?: boolean;
};

const ResearchWorkload1 = ({
  typeOfStudyHandler,
  designationStudyHandler,
  rwlFileHandler,
  designationStudy,
  rwlFileName,
  studyPoints,
  onRemoveRwlFile,
  titleOfStudy,
  titleOfStudyHandler,
  typeOfStudy,
  addStudyHandler,
  isSaved
}: ResearchWorkload1Props) => {
  const fileHandler = (file?: File) => {
    rwlFileHandler(file);
  };

  const setDesignationStudy = (designationStudyValue?: string) => {
    designationStudyHandler(designationStudyValue);
  };

  return (
    <>
      <Container>
        <SubContainer>
          <WorkloadTextContainer>
            <WorkloadText>CvSU Funded Research</WorkloadText>
          </WorkloadTextContainer>
          <InputsContainer>
            <TextInputContainer>
              <Label>Title of the Study</Label>
              <TextInput
                type="text"
                value={titleOfStudy}
                onChange={e => titleOfStudyHandler(e.target.value)}
              />
            </TextInputContainer>
            <TextInputContainer>
              <Dropdown
                option={DROPDOWN_LISTS.STUDY_STATUS}
                label="Status of the Study"
                onSelect={typeOfStudyHandler}
                val={typeOfStudy}
              />
            </TextInputContainer>
            <Dropdown
              option={DROPDOWN_LISTS.DESIGNATION_IN_THE_STUDY}
              label="Designation in the Study"
              onSelect={setDesignationStudy}
              val={designationStudy}
            />
            <TextInputContainer>
              <UploadContainer>
                <UploadTextDescription>
                  Upload Proposal (for Approved Externally Funded Proposal) or
                  Progress Report (for On-going Externally Funded Study) here:
                </UploadTextDescription>
                <UploadFileContainer>
                  <UploadFileButton
                    fileHandler={fileHandler}
                    workloadFileName={rwlFileName}
                    onRemoveFile={onRemoveRwlFile}
                  />
                </UploadFileContainer>
              </UploadContainer>
            </TextInputContainer>
          </InputsContainer>

          <TotalPointsContainer>
            <Label style={{ fontWeight: "bold" }}>
              Study Points = {studyPoints.toString()}
            </Label>
          </TotalPointsContainer>
          {studyPoints !== 0 && !isSaved && (
            <AddStudyContainer onClick={addStudyHandler}>
              <AddStudyText>Add another study</AddStudyText>
            </AddStudyContainer>
          )}
        </SubContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 30px;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubContainer = styled.div`
  border: 2px solid black;
  width: 90%;
  height: auto;
  border-radius: 15px;
  padding: 15px;
`;

const WorkloadTextContainer = styled.div`
  display: flex;
  align-self: flex-start;
`;

const WorkloadText = styled.span`
  font-size: 19px;
  font-weight: 600;
  line-height: 20px;
  font-family: HurmeGeometricSans3;
`;

const InputsContainer = styled.div`
  margin: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: auto;
`;

const TextInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: 400;
  font-size: 17px;
  line-height: 18px;
  font-family: HurmeGeometricSans3;
`;

const UploadContainer = styled.div`
  width: 80%;
  max-width: 500px;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const UploadTextDescription = styled.label`
  font-weight: 600;
  font-size: 17px;
  line-height: 18px;
  font-family: HurmeGeometricSans3;
`;

const TotalPointsContainer = styled.div`
  margin-top: 50px;
  width: 100%;
  padding-left: 40px;
`;

const UploadFileContainer = styled.div`
  max-width: 100px;
`;

const TextInput = styled.input`
  background-color: ${Colors.textFieldBackground};
  border-width: 1px;
  font-family: HurmeGeometricSans3;
`;

const AddStudyContainer = styled.div`
  display: flex;
  margin-bottom: 50px;
  margin-right: 30px;
  justify-content: flex-end;
  align-items: center;
`;

const AddStudyText = styled.span`
  font-family: HurmeGeometricSans3SemiBold;
  font-size: 17px;
  line-height: 18px;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 0.5;
  }
`;

export default ResearchWorkload1;
