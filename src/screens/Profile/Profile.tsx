import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import styled from "styled-components";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import Footer from "../../components/Footer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import Menu from "../../components/Menu";
import ProfileTab from "../../components/ProfileTab";
import TopNav from "../../components/TopNav";
import Colors from "../../constants/Colors";
import { DROPDOWN_LISTS } from "../../constants/Strings";
import {
  ChangePassword,
  CheckESignature,
  EditUserProfile,
  GetUser,
  UploadESignature
} from "../../lib/user.hooks";
import { ESignature } from "../../types/ESignature";
import { User } from "../../types/User";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type ProfileProps = {
  UseLogout: () => void;
};

function Profile({ UseLogout }: ProfileProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSurname, setEditedSurname] = useState("");
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedMiddleInitial, setEditedMiddleInitial] = useState("");
  const [editedCampus, setEditedCampus] = useState("");
  const [editedDepartment, setEditedDepartment] = useState("");
  const [eSignature, setESignature] = useState<ESignature>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasESignature, setHasESignature] = useState<boolean>();
  const [eSignatureFile, setESignatureFile] = useState<File>();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmShowNewPassword] =
    useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  let editedUser = user;
  useEffect(() => {
    (async () => {
      if (userId) {
        const user = await GetUser(userId);
        const haveESignature = await CheckESignature(userId);
        setHasESignature(haveESignature.data);
        setUser(user);
        setEditedSurname(user.surname);
        setEditedFirstName(user.firstName);
        setEditedMiddleInitial(user.middleInitial);
        setEditedCampus(user.campus);
        setEditedDepartment(user.department);
      }
      if (user === undefined) {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, hasESignature]);

  const campusHandler = (campusValue: string) => {
    setEditedCampus(campusValue);
    editedUser!.campus = campusValue;
    setUser(editedUser);
  };

  const departmentHandler = (departmentValue: string) => {
    setEditedDepartment(departmentValue);
    editedUser!.department = departmentValue;
    setUser(editedUser);
  };

  const onSave = async () => {
    setIsSubmitting(true);
    editedUser!.surname = editedSurname;
    editedUser!.firstName = editedFirstName;
    editedUser!.middleInitial = editedMiddleInitial;
    await EditUserProfile(userId, editedUser);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  useEffect(() => {
    (async () => {
      await UploadESignature(eSignature, eSignatureFile);
      setHasESignature(true);
    })();
    setIsSubmitting(false);
  }, [eSignature, eSignatureFile]);

  const onChangePassword = async () => {
    setResponseMessage("");
    setIsSubmitting(true);
    const user = await GetUser(userId!);
    await ChangePassword(user.username, oldPassword, newPassword)
      .then(res => {
        setResponseMessage(res.data);
        setIsSubmitting(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      })
      .catch(error => {
        setResponseMessage(error.response.data.message);
        setIsSubmitting(false);
      });
  };

  return (
    <Container>
      <TopNav profileHandler={() => setIsProfileOpen(!isProfileOpen)} />
      <Menu />
      <ProfileTab isProfileOpen={isProfileOpen} UseLogout={UseLogout} />
      <BodyContainer>
        {isLoading ? (
          <LoadingSpinner color={Colors.primary} />
        ) : isEditing ? (
          <ProfileContainer>
            <ProfileText>Profile</ProfileText>
            <InputsContainer>
              <TextFieldContainer>
                <Label>Surname</Label>
                <TextField
                  type="text"
                  value={editedSurname}
                  onChange={e => setEditedSurname(e.target.value)}
                />
              </TextFieldContainer>
              <TextFieldContainer>
                <Label>First Name</Label>
                <TextField
                  type="text"
                  value={editedFirstName}
                  onChange={e => setEditedFirstName(e.target.value)}
                />
              </TextFieldContainer>
              <TextFieldContainer>
                <Label>Middle Initial</Label>
                <TextField
                  type="text"
                  value={editedMiddleInitial}
                  onChange={e => setEditedMiddleInitial(e.target.value)}
                  maxLength={1}
                />
              </TextFieldContainer>
              <DropDownContainer>
                <Dropdown
                  option={DROPDOWN_LISTS.CAMPUS}
                  label="Campus"
                  onSelect={campusHandler}
                  val={editedCampus ? editedCampus : user?.campus}
                />
              </DropDownContainer>
              <DropDownContainer>
                <Dropdown
                  option={
                    editedUser!.campus === "Bacoor Campus"
                      ? DROPDOWN_LISTS.BACOOR_DEPARTMENT
                      : editedUser!.campus === "Carmona Campus"
                      ? DROPDOWN_LISTS.CARMONA_DEPARTMENT
                      : editedUser!.campus === "Cavite City Campus"
                      ? DROPDOWN_LISTS.CAVITE_CITY_DEPARTMENT
                      : editedUser!.campus === "Gen. Trias Campus"
                      ? DROPDOWN_LISTS.GEN_TRIAS_DEPARTMENT
                      : editedUser!.campus === "Imus Campus"
                      ? DROPDOWN_LISTS.IMUS_DEPARTMENT
                      : editedUser!.campus === "Silang Campus"
                      ? DROPDOWN_LISTS.SILANG_DEPARTMENT
                      : editedUser!.campus === "Tanza Campus"
                      ? DROPDOWN_LISTS.TANZA_DEPARTMENT
                      : editedUser!.campus === "Trece Campus"
                      ? DROPDOWN_LISTS.TRECE_DEPARTMENT
                      : editedUser!.campus === "CAFENR"
                      ? DROPDOWN_LISTS.CAFENR_COLLEGE
                      : editedUser!.campus === "CAS"
                      ? DROPDOWN_LISTS.CAS_COLLEGE
                      : editedUser!.campus === "CCJ"
                      ? DROPDOWN_LISTS.CCJ_COLLEGE
                      : editedUser!.campus === "CED"
                      ? DROPDOWN_LISTS.CED_COLLEGE
                      : editedUser!.campus === "CEIT"
                      ? DROPDOWN_LISTS.CEIT_COLLEGE
                      : editedUser!.campus === "CEMDS"
                      ? DROPDOWN_LISTS.CEMDS_COLLEGE
                      : editedUser!.campus === "CON"
                      ? DROPDOWN_LISTS.CON_COLLEGE
                      : editedUser!.campus === "CSPEAR"
                      ? DROPDOWN_LISTS.CSPEAR_COLLEGE
                      : DROPDOWN_LISTS.CVMBS_COLLEGE
                  }
                  label="Department"
                  onSelect={departmentHandler}
                  val={editedDepartment ? editedDepartment : user?.department}
                />
              </DropDownContainer>
            </InputsContainer>
            <ButtonsContainer>
              <Button
                text="Cancel"
                color="transparent"
                onClick={() => setIsEditing(!isEditing)}
                type="button"
                borderColor={Colors.primary}
                textColor={Colors.primary}
                hoverOpacity="0.5"
              />
              <Button
                text="Save"
                color="transparent"
                onClick={onSave}
                type="button"
                borderColor={Colors.primary}
                textColor={Colors.primary}
                hoverOpacity="0.5"
                isSubmitting={isSubmitting}
              />
            </ButtonsContainer>
          </ProfileContainer>
        ) : isChangingPassword ? (
          <ProfileContainer>
            <ProfileText>Profile</ProfileText>
            <InputsContainer>
              <TextFieldContainer>
                <Label>Old Password</Label>
                <FieldIconContainer>
                  <TextField
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                  {showOldPassword ? (
                    <AiFillEye
                      size={20}
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    />
                  ) : (
                    <AiFillEyeInvisible
                      size={20}
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    />
                  )}
                </FieldIconContainer>
                {
                  <ResponseMessage type="error">
                    {responseMessage === "Invalid Old Password"
                      ? responseMessage
                      : ""}
                  </ResponseMessage>
                }
              </TextFieldContainer>
              <TextFieldContainer>
                <Label>New Password</Label>
                <FieldIconContainer>
                  <TextField
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  {showNewPassword ? (
                    <AiFillEye
                      size={20}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  ) : (
                    <AiFillEyeInvisible
                      size={20}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  )}
                </FieldIconContainer>
              </TextFieldContainer>
              <TextFieldContainer>
                <Label>Confirm New Password</Label>
                <FieldIconContainer>
                  <TextField
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                  />
                  {showConfirmNewPassword ? (
                    <AiFillEye
                      size={20}
                      onClick={() =>
                        setShowConfirmShowNewPassword(!showConfirmNewPassword)
                      }
                    />
                  ) : (
                    <AiFillEyeInvisible
                      size={20}
                      onClick={() =>
                        setShowConfirmShowNewPassword(!showConfirmNewPassword)
                      }
                    />
                  )}
                </FieldIconContainer>
                {
                  <ResponseMessage type="success">
                    {responseMessage === "Change Password Successfully!"
                      ? responseMessage
                      : ""}
                  </ResponseMessage>
                }
                {newPassword !== confirmNewPassword ? (
                  <ResponseMessage type="error">
                    Password not match
                  </ResponseMessage>
                ) : (
                  ""
                )}
              </TextFieldContainer>
            </InputsContainer>
            <ButtonsContainer>
              <Button
                text="Cancel"
                color="transparent"
                onClick={() => {
                  setResponseMessage("");
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setIsChangingPassword(false);
                }}
                type="button"
                borderColor={Colors.primary}
                textColor={Colors.primary}
                hoverOpacity="0.5"
              />
              <Button
                text="Save"
                color="transparent"
                onClick={onChangePassword}
                type="button"
                borderColor={Colors.primary}
                textColor={Colors.primary}
                hoverOpacity="0.5"
                isSubmitting={isSubmitting}
                disable={
                  !oldPassword ||
                  !newPassword ||
                  !confirmNewPassword ||
                  newPassword !== confirmNewPassword
                }
                spinnerColor={Colors.primary}
              />
            </ButtonsContainer>
          </ProfileContainer>
        ) : (
          <ProfileContainer>
            <ProfileText>Profile</ProfileText>
            <EditButton onClick={() => setIsEditing(!isEditing)}>
              <FaEdit size={26} color="black" />
            </EditButton>
            <UserDetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Username: <DetailData>{user?.username}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Cvsu Email:{" "}
                  <DetailDataNoTextTransform>
                    {user?.email}
                  </DetailDataNoTextTransform>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Surname: <DetailData>{user?.surname}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  First Name: <DetailData>{user?.firstName}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Middle Initial: <DetailData>{user?.middleInitial}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Campus: <DetailData>{user?.campus}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Department: <DetailData>{user?.department}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Role: <DetailData>{user?.role}</DetailData>
                </DetailLabel>
              </DetailContainer>
              <DetailContainer>
                <DetailLabel>
                  Academic Rank: <DetailData>{user?.academicRank}</DetailData>
                </DetailLabel>
              </DetailContainer>
            </UserDetailContainer>
            <ButtonsContainer>
              <ButtonStyled onClick={() => setIsChangingPassword(true)}>
                <ButtonText>Change Password</ButtonText>
              </ButtonStyled>
            </ButtonsContainer>
          </ProfileContainer>
        )}
      </BodyContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BodyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const ProfileContainer = styled.div`
  max-width: 599px;
  max-height: 434px;
  background-color: ${Colors.lightBlue};
  padding: 26px;
  border: 1px solid black;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ProfileText = styled.span`
  text-transform: uppercase;
  font-size: 23px;
  font-family: HurmeGeometricSans3Bold;
  line-height: 25.44px;
`;

const UserDetailContainer = styled.div`
  margin: 27px 0 0 38px;
`;

const DetailContainer = styled.div`
  margin-bottom: 13px;
`;

const DetailLabel = styled.span`
  text-transform: uppercase;
  font-family: HurmeGeometricSans3Bold;
  font-size: 15px;
  line-height: 15.26px;
`;

const DetailData = styled.span`
  text-transform: capitalize;
  font-family: HurmeGeometricSans3;
  font-size: 15px;
  line-height: 15.26px;
`;

const DetailDataNoTextTransform = styled.text`
  text-transform: none;
  font-family: HurmeGeometricSans3;
  font-size: 15px;
  line-height: 15.26px;
`;

const FooterContainer = styled.div`
  margin-top: auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 17.6px;
`;

const EditButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 27px;
  top: 27px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 0.4;
  }
`;

const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 210px;
  width: 100%;
`;

const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 218px;
  width: 100%;
  margin-left: 5px;
`;

const TextField = styled.input`
  font-family: HurmeGeometricSans3;
  width: 100%;
  height: 24.03px;
  background-color: #ececec;
  border: none;
  outline: none;
  ::-ms-reveal {
    display: none;
  }
`;

const Label = styled.label`
  font-size: 15px;
  line-height: 15.26px;
  font-family: HurmeGeometricSans3;
`;

const InputsContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonStyled = styled.div`
  background-color: ${Colors.lightBlue};
  width: 137px;
  height: 36px;
  border: 3px solid ${Colors.primary};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 0.5;
  }
  margin: 10px 10px 0 10px;
  cursor: pointer;
`;

const ButtonText = styled.label`
  font-size: 17px;
  line-height: 17.81px;
  font-family: HurmeGeometricSans3SemiBold;
  color: ${Colors.primary};
  cursor: pointer;
  text-align: center;
`;

const FieldIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ececec;
  padding: 0 5px 0 5px;
`;

const ResponseMessage = styled.span<{ type: string }>`
  color: ${p => (p.type === "success" ? "#008000" : "red")};
  font-size: 15px;
  font-family: HurmeGeometricSans3Bold;
`;

export default Profile;
