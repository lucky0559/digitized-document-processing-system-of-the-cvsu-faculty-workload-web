import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../constants/Colors";

type DropdownProps = {
  option: string[];
  label: string;
  onSelect: (option: string) => void;
};

export default function Dropdown({ option, label, onSelect }: DropdownProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    onSelect(value);
  }, [value]);

  return (
    <Container>
      <Label>{label}</Label>
      <Select
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
      >
        {option.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </Select>
    </Container>
  );
}

const Container = styled.div`
  flex-direction: column;
  display: flex;
  margin-top: 15px;
`;

const Select = styled.select`
  width: 186px;
  background-color: ${Colors.textFieldBackground};
`;

const Label = styled.label`
  font-size: 12px;
  font-family: HurmeGeometricSans3;
  font-weight: 400;
`;