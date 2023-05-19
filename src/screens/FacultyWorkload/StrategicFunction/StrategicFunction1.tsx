import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DropdownWithUpload from "../../../components/DropdownWithUpload";
import TextInputWithUpload from "../../../components/TextInputWithUpload";
import { DROPDOWN_LISTS } from "../../../constants/Strings";

type StrategicFunction1Props = {
  onUniversityLevelSelect1: (value: string) => void;
  onUniversityLevelSelect2: (value: string) => void;
  onUniversityLevelSelect3: (value: string) => void;
  textInputUniversityLevel4: (value: string) => void;
  universityLevelInputDesignation: string | undefined;
  displayDesignationUniversity1: string | undefined;
  displayDesignationUniversity2: string | undefined;
  displayDesignationUniversity3: string | undefined;
  onCollegeCampusLevelSelect1: (value: string) => void;
  onCollegeCampusLevelSelect2: (value: string) => void;
  onCollegeCampusLevelSelect3: (value: string) => void;
  textInputCollegeCampusLevel4: (value: string) => void;
  collegeCampusLevelInputDesignation: string | undefined;
  displayDesignationCollegeCampus1: string | undefined;
  displayDesignationCollegeCampus2: string | undefined;
  displayDesignationCollegeCampus3: string | undefined;
  onFileUniversityLevelSelect1: (file?: File) => void;
  onFileUniversityLevelSelect2: (file?: File) => void;
  onFileUniversityLevelSelect3: (file?: File) => void;
  onFileCustomUniversityLevelSelect: (file?: File) => void;
  universityLevelFileName1?: string;
  universityLevelFileName2?: string;
  universityLevelFileName3?: string;
  customUniversityFileName?: string;
  onFileCollegeCampusLevelSelect1: (file?: File) => void;
  onFileCollegeCampusLevelSelect2: (file?: File) => void;
  onFileCollegeCampusLevelSelect3: (file?: File) => void;
  onFileCustomCollegeCampusLevelSelect: (file?: File) => void;
  collegeCampusLevelFileName1?: string;
  collegeCampusLevelFileName2?: string;
  collegeCampusLevelFileName3?: string;
  customcollegeCampusLevelFileName?: string;
};

function StrategicFunction1({
  onUniversityLevelSelect1,
  onUniversityLevelSelect2,
  onUniversityLevelSelect3,
  textInputUniversityLevel4,
  universityLevelInputDesignation,
  displayDesignationUniversity1,
  displayDesignationUniversity2,
  displayDesignationUniversity3,
  onCollegeCampusLevelSelect1,
  onCollegeCampusLevelSelect2,
  onCollegeCampusLevelSelect3,
  textInputCollegeCampusLevel4,
  collegeCampusLevelInputDesignation,
  displayDesignationCollegeCampus1,
  displayDesignationCollegeCampus2,
  displayDesignationCollegeCampus3,
  onFileUniversityLevelSelect1,
  onFileUniversityLevelSelect2,
  onFileUniversityLevelSelect3,
  onFileCustomUniversityLevelSelect,
  universityLevelFileName1,
  universityLevelFileName2,
  universityLevelFileName3,
  customUniversityFileName,
  onFileCollegeCampusLevelSelect1,
  onFileCollegeCampusLevelSelect2,
  onFileCollegeCampusLevelSelect3,
  onFileCustomCollegeCampusLevelSelect,
  collegeCampusLevelFileName1,
  collegeCampusLevelFileName2,
  collegeCampusLevelFileName3,
  customcollegeCampusLevelFileName
}: StrategicFunction1Props) {
  return (
    <>
      <UniversityLevelContainer>
        <LevelLabel>Designation at the University Level</LevelLabel>
        <div>
          <DropdownWithUpload
            inputLabel="Designation 1"
            uploadLabel="Upload approved university designation here:"
            options={DROPDOWN_LISTS.DESIGNATION_UNIVERSITY_LEVEL}
            onSelect={onUniversityLevelSelect1}
            val={displayDesignationUniversity1}
            selected={[
              displayDesignationUniversity2!,
              displayDesignationUniversity3!
            ]}
            onFileSelect={onFileUniversityLevelSelect1}
            fileName={universityLevelFileName1}
          />
          <DropdownWithUpload
            inputLabel="Designation 2"
            options={DROPDOWN_LISTS.DESIGNATION_UNIVERSITY_LEVEL}
            onSelect={onUniversityLevelSelect2}
            val={displayDesignationUniversity2}
            selected={[
              displayDesignationUniversity1!,
              displayDesignationUniversity3!
            ]}
            onFileSelect={onFileUniversityLevelSelect2}
            fileName={universityLevelFileName2}
          />
          <DropdownWithUpload
            inputLabel="Designation 3"
            options={DROPDOWN_LISTS.DESIGNATION_UNIVERSITY_LEVEL}
            onSelect={onUniversityLevelSelect3}
            val={displayDesignationUniversity3}
            selected={[
              displayDesignationUniversity1!,
              displayDesignationUniversity2!
            ]}
            onFileSelect={onFileUniversityLevelSelect3}
            fileName={universityLevelFileName3}
          />
          <TextInputWithUpload
            inputLabel="Other Designation"
            onChangeTextInput={textInputUniversityLevel4}
            val={universityLevelInputDesignation}
            onFileSelect={onFileCustomUniversityLevelSelect}
            fileName={customUniversityFileName}
          />
        </div>
      </UniversityLevelContainer>
      <CollegeCampusLevelContainer>
        <LevelLabel>Designation at the College/Campus Level</LevelLabel>
        <div>
          <DropdownWithUpload
            inputLabel="Designation 1"
            uploadLabel="Upload approved college designation here:"
            options={DROPDOWN_LISTS.DESIGNATION_COLLEGE_CAMPUS_LEVEL}
            onSelect={onCollegeCampusLevelSelect1}
            val={displayDesignationCollegeCampus1}
            selected={[
              displayDesignationCollegeCampus2!,
              displayDesignationCollegeCampus3!
            ]}
            onFileSelect={onFileCollegeCampusLevelSelect1}
            fileName={collegeCampusLevelFileName1}
          />
          <DropdownWithUpload
            inputLabel="Designation 2"
            options={DROPDOWN_LISTS.DESIGNATION_COLLEGE_CAMPUS_LEVEL}
            onSelect={onCollegeCampusLevelSelect2}
            val={displayDesignationCollegeCampus2}
            selected={[
              displayDesignationCollegeCampus1!,
              displayDesignationCollegeCampus3!
            ]}
            onFileSelect={onFileCollegeCampusLevelSelect2}
            fileName={collegeCampusLevelFileName2}
          />
          <DropdownWithUpload
            inputLabel="Designation 3"
            options={DROPDOWN_LISTS.DESIGNATION_COLLEGE_CAMPUS_LEVEL}
            onSelect={onCollegeCampusLevelSelect3}
            val={displayDesignationCollegeCampus3}
            selected={[
              displayDesignationCollegeCampus1!,
              displayDesignationCollegeCampus2!
            ]}
            onFileSelect={onFileCollegeCampusLevelSelect3}
            fileName={collegeCampusLevelFileName3}
          />
          <TextInputWithUpload
            inputLabel="Other Designation"
            onChangeTextInput={textInputCollegeCampusLevel4}
            val={collegeCampusLevelInputDesignation}
            onFileSelect={onFileCustomCollegeCampusLevelSelect}
            fileName={customcollegeCampusLevelFileName}
          />
        </div>
      </CollegeCampusLevelContainer>
    </>
  );
}

const UniversityLevelContainer = styled.div`
  border: 2px solid black;
  width: 100%;
  height: auto;
  border-radius: 15px;
  padding: 15px;
  margin: 20px 0;
`;

const CollegeCampusLevelContainer = styled.div`
  border: 2px solid black;
  width: 100%;
  height: auto;
  border-radius: 15px;
  padding: 15px;
`;

const LevelLabel = styled.text`
  font-size: 20px;
  line-height: 18px;
  font-family: HurmeGeometricSans3SemiBold;
`;

export default StrategicFunction1;
