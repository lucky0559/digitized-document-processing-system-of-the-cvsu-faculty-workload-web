import React, { useEffect, useState } from "react";
import { GetAllUserPendingWorkloads } from "../../lib/faculty-workload.hooks";
import { TeachingWorkLoadType } from "../../types/TeachingWorkload";
import { ExtensionWorkloadType } from "../../types/ExtensionWorkload";
import { ResearchWorkLoadType } from "../../types/ResearchWorkLoad";
import { StrategicFunctionType } from "../../types/StrategicFunction";
import styled from "styled-components";
import { GetUser } from "../../lib/user.hooks";
import { User } from "../../types/User";
import Colors from "../../constants/Colors";
import FormButton from "../../components/FormButton";
import { LoadingSpinner } from "../../components/LoadingSpinner";

type ReviewFacultyScreenProps = {
  userEmail?: string;
};

const ReviewFacultyScreen = ({ userEmail }: ReviewFacultyScreenProps) => {
  const [allTeachingWorkloads, setAllTeachingWorkloads] =
    useState<TeachingWorkLoadType[]>();
  const [allExtensionWorkloads, setAllExtensionWorkloads] =
    useState<ExtensionWorkloadType[]>();
  const [allResearchWorkloads, setAllResearchWorkloads] =
    useState<ResearchWorkLoadType[]>();
  const [allStrategicFunctionWorkloads, setAllStrategicFunctionWorkloads] =
    useState<StrategicFunctionType[]>();

  const [isDataLoading, setIsDataLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState<User>();

  const [ovpaaTotalTwlPoints, setOvpaaTotalTwlPoints] = useState(0);
  const [ovpaaTotalRwlPoints, setOvpaaTotalRwlPoints] = useState(0);
  const [ovpaaTotalEwlPoints, setOvpaaTotalEwlPoints] = useState(0);
  const [ovpaaTotalSfPoints, setOvpaaTotalSfPoints] = useState(0);

  const [ovpaaRemarks, setOvpaaRemarks] = useState("");

  useEffect(() => {
    (async () => {
      const user = await GetUser(userId!);
      setUser(user);
      const {
        teachingWorkloads,
        extensionWorkloads,
        researchWorkloads,
        strategicFunctionWorkloads
      } = await GetAllUserPendingWorkloads(userEmail!);
      setAllTeachingWorkloads(teachingWorkloads);
      setAllExtensionWorkloads(extensionWorkloads);
      setAllResearchWorkloads(researchWorkloads);
      setAllStrategicFunctionWorkloads(strategicFunctionWorkloads);
      setIsDataLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (allTeachingWorkloads?.length! > 0) {
      setOvpaaTotalTwlPoints(
        Number(allTeachingWorkloads?.[0].remarks?.points) || 0
      );
      // setOvpaaRemarks(allTeachingWorkloads?.[0].remarks?.remarks!);
      if (allTeachingWorkloads?.[0].remarks?.remarks?.length! > 0)
        setOvpaaRemarks(allTeachingWorkloads?.[0].remarks?.remarks!);
    }
  }, [allTeachingWorkloads]);

  useEffect(() => {
    if (allResearchWorkloads?.length! > 0) {
      const total = allResearchWorkloads?.reduce((accumulator, object) => {
        return accumulator + Number(object.remarks?.points);
      }, 0);
      console.log(allResearchWorkloads);
      setOvpaaTotalRwlPoints(total || 0);
      if (allResearchWorkloads?.[0].remarks?.remarks?.length! > 0)
        setOvpaaRemarks(allResearchWorkloads?.[0].remarks?.remarks!);
    }
  }, [allResearchWorkloads]);

  useEffect(() => {
    if (allExtensionWorkloads?.length! > 0) {
      const total = allExtensionWorkloads?.reduce((accumulator, object) => {
        return accumulator + Number(object.remarks?.points);
      }, 0);
      setOvpaaTotalEwlPoints(total || 0);
      if (allExtensionWorkloads?.[0].remarks?.remarks?.length! > 0)
        setOvpaaRemarks(allExtensionWorkloads?.[0].remarks?.remarks!);
    }
  }, [allExtensionWorkloads]);

  useEffect(() => {
    if (allStrategicFunctionWorkloads?.length! > 0) {
      const total = allStrategicFunctionWorkloads?.reduce(
        (accumulator, object) => {
          return accumulator + Number(object.remarks?.points);
        },
        0
      );
      setOvpaaTotalSfPoints(total || 0);
      if (allStrategicFunctionWorkloads?.[0].remarks?.remarks?.length! > 0)
        setOvpaaRemarks(allStrategicFunctionWorkloads?.[0].remarks?.remarks!);
    }
  }, [allStrategicFunctionWorkloads]);

  let totalTwlPoints = 0;
  let totalEwlPoints = 0;
  let totalRwlPoints = 0;
  let totalSfPoints = 0;

  const onPrint = () => {
    window.print();
  };

  return (
    <>
      {!allTeachingWorkloads &&
      !allExtensionWorkloads &&
      !allResearchWorkloads &&
      !allStrategicFunctionWorkloads ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <LoadingSpinner color={Colors.primary} />
        </div>
      ) : (
        <Container>
          <div id="printable">
            <HeaderText>{user?.firstName + " " + user?.surname}</HeaderText>
            <UserInfoContainer>
              <ColumnContainer>
                <ThinText>College:</ThinText>
                <ThinText>Department:</ThinText>
                <ThinText>Academic Rank:</ThinText>
              </ColumnContainer>
              <ColumnContainer>
                <BoldText>{user?.campus}</BoldText>
                <BoldText>{user?.department}</BoldText>
                <BoldText>{user?.academicRank}</BoldText>
              </ColumnContainer>
            </UserInfoContainer>

            {/* TEACHING WORKLOAD */}
            <WorkloadDetailContainer>
              {allTeachingWorkloads?.map(workload => {
                totalTwlPoints = Number(
                  (+workload.totalTeachingWorkload! + +totalTwlPoints).toFixed(
                    2
                  )
                );

                return (
                  <>
                    <BoldText>Teaching Work Load (TWL)</BoldText>
                    <ColumnParentContainer>
                      <ColumnContainer>
                        {workload.numberOfPreparations && (
                          <ThinText>Number of Preparation:</ThinText>
                        )}
                        {workload.contactHours && (
                          <ThinText>Number of Contact Hours:</ThinText>
                        )}
                        {workload.totalNoOfStudents && (
                          <ThinText>Number of Students:</ThinText>
                        )}
                      </ColumnContainer>
                      <ColumnContainer>
                        <BoldText>{workload.numberOfPreparations}</BoldText>
                        <BoldText>{workload.contactHours}</BoldText>
                        <BoldText>{workload.totalNoOfStudents}</BoldText>
                      </ColumnContainer>
                    </ColumnParentContainer>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 25
                      }}
                    >
                      <ColumnContainer style={{ paddingLeft: 90 }}>
                        <BoldText>TOTAL:</BoldText>
                      </ColumnContainer>
                      <ColumnContainer>
                        <BoldText>
                          {Number(workload.totalTeachingWorkload).toFixed(2)}
                        </BoldText>
                      </ColumnContainer>
                    </div>
                  </>
                );
              })}
            </WorkloadDetailContainer>

            {/* RESEARCH WORKLOAD */}
            <WorkloadDetailContainer>
              {allResearchWorkloads?.map(workload => {
                totalRwlPoints = Number(
                  (+totalRwlPoints + +workload.rwlPoints!).toFixed(2)
                );
                return (
                  <>
                    <BoldText style={{ marginBottom: 20 }}>
                      Research Work Load (RWL)
                    </BoldText>
                    {workload.cvsuFunded.map(funded => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            borderBottom: "1px solid black"
                          }}
                        >
                          <ColumnContainer>
                            <BoldText style={{ marginBottom: 10 }}>
                              CvSU Funded Research
                            </BoldText>
                            <ThinText>Title of the Study:</ThinText>
                            <ThinText>Type of Study:</ThinText>
                            <ThinText>Designation in the Study:</ThinText>
                          </ColumnContainer>
                          <ColumnContainer>
                            <BoldText style={{ marginBottom: 10 }}>
                              &nbsp;
                            </BoldText>
                            <BoldText>{funded.title}</BoldText>
                            <BoldText>{funded.typeOfStudy}</BoldText>
                            <BoldText>{funded.designationStudy}</BoldText>
                          </ColumnContainer>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 25
                          }}
                        >
                          <ColumnContainer>
                            <BoldText>TOTAL:</BoldText>
                          </ColumnContainer>
                          <ColumnContainer>
                            <BoldText>{funded.points}</BoldText>
                          </ColumnContainer>
                        </div>
                      </>
                    ))}
                    {workload.externallyFunded.map(funded => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            borderBottom: "1px solid black"
                          }}
                        >
                          <ColumnContainer>
                            <BoldText style={{ marginBottom: 10 }}>
                              Externally Funded Research
                            </BoldText>
                            <ThinText>Title of the Study:</ThinText>
                            <ThinText>
                              Fund Generated per Semester (in peso):
                            </ThinText>
                          </ColumnContainer>
                          <ColumnContainer>
                            <BoldText style={{ marginBottom: 10 }}>
                              &nbsp;
                            </BoldText>
                            <BoldText>{funded.title}</BoldText>
                            <BoldText>{funded.fundGenerated}</BoldText>
                          </ColumnContainer>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 25
                          }}
                        >
                          <ColumnContainer>
                            <BoldText>TOTAL:</BoldText>
                          </ColumnContainer>
                          <ColumnContainer>
                            <BoldText>{funded.points}</BoldText>
                          </ColumnContainer>
                        </div>
                      </>
                    ))}
                  </>
                );
              })}
            </WorkloadDetailContainer>

            {/* EXTENSION WORKLOAD */}
            <WorkloadDetailContainer>
              {allExtensionWorkloads?.map(workload => {
                totalEwlPoints = Number(
                  (+totalEwlPoints + +workload.ewlPoints!).toFixed(2)
                );
                return (
                  <>
                    <BoldText>Extension Work Load (EWL)</BoldText>
                    <ColumnParentContainer>
                      <ColumnContainer>
                        {workload.designationExtensionActivity && (
                          <ThinText>
                            Designation in Extension Activity:
                          </ThinText>
                        )}
                        {workload.totalNumberHours && (
                          <ThinText>
                            Number of Hours rendered in Extension Activity:
                          </ThinText>
                        )}
                        {workload.resourcePerson && (
                          <ThinText>
                            Resource Person in an Extension Activity:
                          </ThinText>
                        )}
                      </ColumnContainer>
                      <ColumnContainer>
                        <BoldText>
                          {workload.designationExtensionActivity}
                        </BoldText>
                        <BoldText>{workload.totalNumberHours}</BoldText>
                        <BoldText>
                          {workload.resourcePerson?.join(", ")}
                        </BoldText>
                      </ColumnContainer>
                    </ColumnParentContainer>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 25
                      }}
                    >
                      <ColumnContainer style={{ paddingLeft: 90 }}>
                        <BoldText>TOTAL:</BoldText>
                      </ColumnContainer>
                      <ColumnContainer>
                        <BoldText>
                          {Number(workload.ewlPoints).toFixed(2)}
                        </BoldText>
                      </ColumnContainer>
                    </div>
                  </>
                );
              })}
            </WorkloadDetailContainer>

            {/* STRATEGIC FUNCTION WORKLOAD */}
            <WorkloadDetailContainer>
              {allStrategicFunctionWorkloads?.map((workload, index) => {
                totalSfPoints = Number(
                  (+totalSfPoints + +workload.sfwPoints!).toFixed(2)
                );
                return (
                  <div key={index}>
                    <BoldText>Strategic Function Work Load (SF)</BoldText>
                    <ColumnParentContainer>
                      <ParentLevelContainer>
                        <LevelContainer>
                          {workload.designationUniversityLevel?.length! > 0 && (
                            <>
                              <ColumnContainer>
                                <ThinText>University Level:</ThinText>
                              </ColumnContainer>
                              <ColumnContainer>
                                {workload.designationUniversityLevel?.map(
                                  designationUniversityLevel => {
                                    return (
                                      <BoldText>
                                        {designationUniversityLevel}
                                      </BoldText>
                                    );
                                  }
                                )}
                              </ColumnContainer>
                            </>
                          )}
                        </LevelContainer>
                        <LevelContainer>
                          {workload.designationCollegeCampusLevel?.length! >
                            0 && (
                            <>
                              <ColumnContainer>
                                <ThinText>College Level:</ThinText>
                              </ColumnContainer>
                              <ColumnContainer>
                                {workload.designationCollegeCampusLevel?.map(
                                  designationCollegeCampusLevel => {
                                    return (
                                      <BoldText>
                                        {designationCollegeCampusLevel}
                                      </BoldText>
                                    );
                                  }
                                )}
                              </ColumnContainer>
                            </>
                          )}
                        </LevelContainer>

                        <LevelContainer>
                          {workload.designationDepartmentLevel?.length! > 0 && (
                            <>
                              <ColumnContainer>
                                <ThinText>Department Level:</ThinText>
                              </ColumnContainer>
                              <ColumnContainer>
                                {workload.designationDepartmentLevel?.map(
                                  designationDepartmentLevel => {
                                    return (
                                      <BoldText>
                                        {designationDepartmentLevel}
                                      </BoldText>
                                    );
                                  }
                                )}
                              </ColumnContainer>
                            </>
                          )}
                        </LevelContainer>

                        <LevelContainer>
                          {workload.academicAdvisees && (
                            <>
                              <ColumnContainer>
                                <ThinText>
                                  Designation as Academic Adviser:
                                </ThinText>
                              </ColumnContainer>
                              <ColumnContainer>
                                <BoldText>{workload.academicAdvisees}</BoldText>
                              </ColumnContainer>
                            </>
                          )}
                        </LevelContainer>
                      </ParentLevelContainer>
                    </ColumnParentContainer>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <ColumnContainer style={{ paddingLeft: 90 }}>
                        <BoldText>TOTAL:</BoldText>
                      </ColumnContainer>
                      <ColumnContainer>
                        <BoldText>{workload.sfwPoints}</BoldText>
                      </ColumnContainer>
                    </div>
                  </div>
                );
              })}
            </WorkloadDetailContainer>
            <ComputationContainer>
              <BoldText style={{ marginBottom: 30 }}>
                TWL + RWL + EWL + SF = TOTAL EARNED CREDIT UNITS
              </BoldText>
              <BoldText style={{ fontSize: 20 }}>
                {totalTwlPoints} + {totalRwlPoints} + {totalEwlPoints} +{" "}
                {totalSfPoints} ={" "}
                {(
                  +totalTwlPoints +
                  +totalRwlPoints +
                  +totalEwlPoints +
                  +totalSfPoints
                ).toFixed(2)}
              </BoldText>
              <OvpaaContainerPointsRemarks>
                <RemarksContainer>
                  <BoldText>Remarks: </BoldText>

                  <ThinText>{ovpaaRemarks}</ThinText>
                </RemarksContainer>
                <PointsContainer>
                  <BoldText>Total Teaching Workload Points: </BoldText>
                  <ThinText>{ovpaaTotalTwlPoints}</ThinText>
                </PointsContainer>
                <PointsContainer>
                  <BoldText>Total Research Workload Points: </BoldText>
                  <ThinText>{ovpaaTotalRwlPoints}</ThinText>
                </PointsContainer>
                <PointsContainer>
                  <BoldText>Total Extension Workload Points: </BoldText>
                  <ThinText>{ovpaaTotalEwlPoints}</ThinText>
                </PointsContainer>
                <PointsContainer>
                  <BoldText>
                    Total Strategic Function Workload Points:{" "}
                  </BoldText>
                  <ThinText>{ovpaaTotalSfPoints}</ThinText>
                </PointsContainer>
              </OvpaaContainerPointsRemarks>
            </ComputationContainer>
          </div>
          <ButtonContainer>
            <FormButton text="Print" onClicked={onPrint} />
          </ButtonContainer>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 5px solid black;
  border-radius: 15px;
  margin: 10px auto;
  padding: 20px;
  width: 80%;
  @media print {
    width: 100%;
    margin-right: 200px;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  margin-top: 25px;
`;

const ColumnContainer = styled.div`
  flex-direction: column;
  display: flex;
  padding: 10px;
`;

const ThinText = styled.span`
  font-family: HurmeGeometricSans3;
  font-size: 15px;
  line-height: 15px;
`;
const BoldText = styled.span`
  font-family: HurmeGeometricSans3Bold;
  font-weight: bold;
  font-size: 15px;
  line-height: 15px;
`;

const HeaderText = styled.span`
  font-family: HurmeGeometricSans3Bold;
  font-weight: bold;
  font-size: 20px;
  line-height: 15px;
  text-transform: uppercase;
`;

const WorkloadDetailContainer = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  padding: 10px;
`;

const ColumnParentContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 35px;
  border-bottom: 1px solid black;
`;

const LevelContainer = styled.div`
  display: flex;
`;

const ParentLevelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ComputationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding: 10px;
  margin-top: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  @media print {
    display: none;
  }
`;

const OvpaaContainerPointsRemarks = styled.div`
  margin-top: 20px;
  border: 3px solid black;
  border-radius: 15px;
  padding: 20px;
`;

const RemarksContainer = styled.div``;

const PointsContainer = styled.div``;

export default ReviewFacultyScreen;
