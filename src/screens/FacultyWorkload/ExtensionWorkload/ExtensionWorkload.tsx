import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Confirm } from "semantic-ui-react";
import Dropdown from "../../../components/Dropdown";
import { DROPDOWN_LISTS, WorkloadType } from "../../../constants/Strings";
import UploadFileButton from "../../../components/UploadFileButton";
import FormButton from "../../../components/FormButton";
import { ExtensionWorkloadType } from "../../../types/ExtensionWorkload";
import TopNav from "../../../components/TopNav";
import Menu from "../../../components/Menu";
import ProfileTab from "../../../components/ProfileTab";
import {
  GetAllUserPendingWorkloads,
  SaveExtensionWorkload
} from "../../../lib/faculty-workload.hooks";
import ScreenTitle from "../../../components/ScreenTitle";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";
import DesignationExtensionActivity from "./DesignationExtensionActivity";
import { UserContext } from "../../../App";
import { WORKLOAD_STATUS } from "../../../enums/workloadEnums";
import { getEwlSavedWorkload } from "../../../lib/ewl.hooks";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import Colors from "../../../constants/Colors";
import { getConfig } from "../../../lib/config.hooks";

type ExtensionWorkloadProps = {
  UseLogout: () => void;
};

const ExtensionWorkload = ({ UseLogout }: ExtensionWorkloadProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [extensionWorkload, setExtensionWorkload] =
    useState<ExtensionWorkloadType>();

  const [designationExtensionActivity, setDesignationExtensionActivity] =
    useState<string[] | undefined>();
  const [leader, setLeader] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const [facilitator, setFacilitator] = useState("");
  const [assistants, setAssistants] = useState("");
  const [extensionActivityFile, setExtensionActivityFile] = useState<File>();
  const [resourcePerson, setResourcePerson] = useState<string>("");
  const [resourcePerson1, setResourcePerson1] = useState<string>("");
  const [resourcePerson2, setResourcePerson2] = useState<string>("");
  const [certificateFile, setCertificateFile] = useState<File>();
  const [certificateFile1, setCertificateFile1] = useState<File>();
  const [certificateFile2, setCertificateFile2] = useState<File>();
  const [totalNumberHours, setTotalNumberHours] = useState<string | undefined>(
    ""
  );
  const [summaryOfHoursFile, setSummaryOfHoursFile] = useState<File>();

  const [designationActivityPoints, setDesignationActivityPoints] = useState(0);
  const [resourcePersonActivityPoints, setResourcePersonActivityPoints] =
    useState(0);
  const [resourcePersonPoints, setResourcePersonPoints] = useState(0);
  const [resourcePersonPoints1, setResourcePersonPoints1] = useState(0);
  const [resourcePersonPoints2, setResourcePersonPoints2] = useState(0);

  const [isConfirming, setIsConfirming] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { user, actions } = useContext(UserContext);

  const extensionWorkloadHandler = async () => {
    setExtensionWorkload({
      ...extensionWorkload,
      designationExtensionActivity: [
        leader,
        coordinator,
        facilitator,
        assistants
      ].filter(Boolean),
      extensionActivityFile,
      resourcePerson:
        (resourcePerson &&
          (extensionWorkload?.certificateFilenames?.[0] || certificateFile)) ||
        (resourcePerson1 &&
          (extensionWorkload?.certificateFilenames?.[1] || certificateFile1)) ||
        (resourcePerson2 &&
          (extensionWorkload?.certificateFilenames?.[2] || certificateFile2))
          ? [
              resourcePerson
                ? resourcePerson
                : extensionWorkload?.resourcePerson?.[0]!,
              resourcePerson1
                ? resourcePerson1
                : extensionWorkload?.resourcePerson?.[1]!,
              resourcePerson2
                ? resourcePerson2
                : extensionWorkload?.resourcePerson?.[2]!
            ].filter(Boolean)
          : extensionWorkload?.resourcePerson,
      certificateFile: [certificateFile!, certificateFile1!, certificateFile2!],
      totalNumberHours,
      summaryOfHoursFile
    });

    setIsSubmitting(true);
    setIsConfirming(false);
  };

  useEffect(() => {
    (async () => {
      if (isSubmitting) {
        if (
          (extensionWorkload?.designationExtensionActivity &&
            (extensionWorkload.extensionActivityFile ||
              extensionWorkload.extensionActivityFilename)) ||
          (extensionWorkload?.resourcePerson &&
            (extensionWorkload.certificateFile ||
              extensionWorkload.certificateFilenames)) ||
          (extensionWorkload?.totalNumberHours &&
            (extensionWorkload.summaryOfHoursFile ||
              extensionWorkload.summaryOfHoursFilename))
        ) {
          let designationExtensionActivityPoints;
          let totalNumberHoursPoints;
          if (
            extensionWorkload.designationExtensionActivity?.includes(
              "Project Leader"
            )
          ) {
            designationExtensionActivityPoints =
              Number(designationExtensionActivityPoints) + 3;
          }
          if (
            extensionWorkload.designationExtensionActivity?.includes(
              "Project Coordinator"
            )
          ) {
            designationExtensionActivityPoints =
              Number(designationExtensionActivityPoints) + 2.5;
          }
          if (
            extensionWorkload.designationExtensionActivity?.includes(
              "Project Facilitator"
            )
          ) {
            designationExtensionActivityPoints =
              Number(designationExtensionActivityPoints) + 2;
          }
          if (
            extensionWorkload.designationExtensionActivity?.includes(
              "Project Assistants"
            )
          ) {
            designationExtensionActivityPoints =
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              Number(designationExtensionActivityPoints) + 1;
          }

          if (Number(extensionWorkload.totalNumberHours) * 0.05556 >= 3) {
            totalNumberHoursPoints = 3;
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            totalNumberHoursPoints =
              parseFloat(extensionWorkload.totalNumberHours!) * 0.05556;
          }

          extensionWorkload.hoursRenderedPoints = !summaryOfHoursFile
            ? 0
            : Number(totalNumberHours) * 0.05556 >= 3
            ? 3
            : Number((Number(totalNumberHours) * 0.05556).toFixed(2));

          extensionWorkload.designationPoints = designationActivityPoints;

          extensionWorkload.resourcePerson1Points = resourcePersonPoints;
          extensionWorkload.resourcePerson2Points = resourcePersonPoints1;
          extensionWorkload.resourcePerson3Points = resourcePersonPoints2;

          extensionWorkload.ewlPoints =
            designationActivityPoints +
            resourcePersonActivityPoints +
            (!summaryOfHoursFile
              ? 0
              : Number(totalNumberHours) * 0.05556 >= 3
              ? 3
              : Number((Number(totalNumberHours) * 0.05556).toFixed(2)));

          await SaveExtensionWorkload(extensionWorkload, WORKLOAD_STATUS.SAVE);
          const {
            teachingWorkloads,
            extensionWorkloads,
            researchWorkloads,
            strategicFunctionWorkloads
          } = await GetAllUserPendingWorkloads(user.email);
          const { data: config } = await getConfig();
          const isAbleToSubmit =
            new Date() >= new Date(config.submissionDateStart) &&
            new Date() <= new Date(config.submissionDateEnd);
          actions.setHasPendingTeachingWorkload(
            !!teachingWorkloads.length && teachingWorkloads[0].isSubmitted
          );
          actions.setHasPendingExtensionWorkload(
            !!extensionWorkloads.length && extensionWorkloads[0].isSubmitted
          );
          actions.setHasPendingResearchWorkload(
            !!researchWorkloads.length && researchWorkloads[0].isSubmitted
          );
          actions.setHasPendingStrategicWorkload(
            !!strategicFunctionWorkloads.length &&
              strategicFunctionWorkloads[0].isSubmitted
          );
          setIsSubmitting(false);
          clearStates();
          if (!!!strategicFunctionWorkloads.length && isAbleToSubmit) {
            navigate("/strategic-function-workload", { replace: true });
          } else {
            navigate("/workload-summary", { replace: true });
          }
        }
      }
    })();
  });

  const clearStates = () => {
    setDesignationExtensionActivity(undefined);
    setExtensionActivityFile(undefined);
    setResourcePerson("");
    setResourcePerson1("");
    setResourcePerson2("");
    setCertificateFile(undefined);
    setCertificateFile1(undefined);
    setCertificateFile2(undefined);
    setTotalNumberHours("");
    setSummaryOfHoursFile(undefined);
    setExtensionWorkload(undefined);
  };

  const extensionActivityFileHandler = (value?: File) => {
    setExtensionActivityFile(value);
  };

  const resourcePersonHandler = (value: string) => {
    setResourcePerson(value);
  };

  const resourcePersonHandler1 = (value: string) => {
    setResourcePerson1(value);
  };

  const resourcePersonHandler2 = (value: string) => {
    setResourcePerson2(value);
  };

  const certificateFileHandler = (value?: File) => {
    setCertificateFile(value);
  };

  const certificateFileHandler1 = (value?: File) => {
    setCertificateFile1(value);
  };

  const certificateFileHandler2 = (value?: File) => {
    setCertificateFile2(value);
  };

  const totalNumberHoursHandler = (value?: string) => {
    if (value?.length! > 3 || Number(value) > 100) {
      return;
    } else {
      setTotalNumberHours(value);
    }
  };

  const summaryOfHoursFileHandler = (value?: File) => {
    setSummaryOfHoursFile(value);
  };

  const setExtensionActivityFileHandler = (file?: File) => {
    extensionActivityFileHandler(file);
  };

  const setCertificateFileHandler = (file?: File) => {
    certificateFileHandler(file);
  };

  const setCertificateFileHandler1 = (file?: File) => {
    certificateFileHandler1(file);
  };

  const setCertificateFileHandler2 = (file?: File) => {
    certificateFileHandler2(file);
  };

  const setSummaryOfHoursFileHandler = (file?: File) => {
    summaryOfHoursFileHandler(file);
  };

  useEffect(() => {
    if (
      (resourcePerson || extensionWorkload?.resourcePerson?.[0]) ===
        "International" &&
      (certificateFile || extensionWorkload?.certificateFilenames?.[0])
    ) {
      setResourcePersonPoints(4);
    } else if (
      (resourcePerson || extensionWorkload?.resourcePerson?.[0]) ===
        "National" &&
      (certificateFile || extensionWorkload?.certificateFilenames?.[0])
    ) {
      setResourcePersonPoints(3);
    } else if (
      (resourcePerson || extensionWorkload?.resourcePerson?.[0]) ===
        "Regional" &&
      (certificateFile || extensionWorkload?.certificateFilenames?.[0])
    ) {
      setResourcePersonPoints(2);
    } else if (
      (resourcePerson || extensionWorkload?.resourcePerson?.[0]) === "Local" &&
      (certificateFile || extensionWorkload?.certificateFilenames?.[0])
    ) {
      setResourcePersonPoints(1);
    } else {
      setResourcePersonPoints(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resourcePerson,
    certificateFile,
    extensionWorkload?.resourcePerson,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    extensionWorkload?.certificateFilenames?.[0]
  ]);

  useEffect(() => {
    if (
      (resourcePerson1 || extensionWorkload?.resourcePerson?.[1]) ===
        "International" &&
      (certificateFile1 || extensionWorkload?.certificateFilenames?.[1])
    ) {
      setResourcePersonPoints1(4);
    } else if (
      (resourcePerson1 || extensionWorkload?.resourcePerson?.[1]) ===
        "National" &&
      (certificateFile1 || extensionWorkload?.certificateFilenames?.[1])
    ) {
      setResourcePersonPoints1(3);
    } else if (
      (resourcePerson1 || extensionWorkload?.resourcePerson?.[1]) ===
        "Regional" &&
      (certificateFile1 || extensionWorkload?.certificateFilenames?.[1])
    ) {
      setResourcePersonPoints1(2);
    } else if (
      (resourcePerson1 || extensionWorkload?.resourcePerson?.[1]) === "Local" &&
      (certificateFile1 || extensionWorkload?.certificateFilenames?.[1])
    ) {
      setResourcePersonPoints1(1);
    } else {
      setResourcePersonPoints1(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resourcePerson1,
    certificateFile1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    extensionWorkload?.certificateFilenames?.[1],
    extensionWorkload?.resourcePerson
  ]);

  useEffect(() => {
    if (
      (resourcePerson2 || extensionWorkload?.resourcePerson?.[2]) ===
        "International" &&
      (certificateFile2 || extensionWorkload?.certificateFilenames?.[2])
    ) {
      setResourcePersonPoints2(4);
    } else if (
      (resourcePerson2 || extensionWorkload?.resourcePerson?.[2]) ===
        "National" &&
      (certificateFile2 || extensionWorkload?.certificateFilenames?.[2])
    ) {
      setResourcePersonPoints2(3);
    } else if (
      (resourcePerson2 || extensionWorkload?.resourcePerson?.[2]) ===
        "Regional" &&
      (certificateFile2 || extensionWorkload?.certificateFilenames?.[2])
    ) {
      setResourcePersonPoints2(2);
    } else if (
      (resourcePerson2 || extensionWorkload?.resourcePerson?.[2]) === "Local" &&
      (certificateFile2 || extensionWorkload?.certificateFilenames?.[2])
    ) {
      setResourcePersonPoints2(1);
    } else {
      setResourcePersonPoints2(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resourcePerson2,
    certificateFile2,
    extensionWorkload?.resourcePerson,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    extensionWorkload?.certificateFilenames?.[2]
  ]);

  useEffect(() => {
    setResourcePersonActivityPoints(
      resourcePersonPoints + resourcePersonPoints1 + resourcePersonPoints2
    );
  }, [resourcePersonPoints, resourcePersonPoints1, resourcePersonPoints2]);

  const onChangeValueCheckbox = (isChecked: boolean, value: string) => {
    if (isChecked) {
      if (value === "Project Leader") {
        setLeader("Project Leader");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints + 3);
        }
      } else if (value === "Project Coordinator") {
        setCoordinator("Project Coordinator");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints + 2.5);
        }
      } else if (value === "Project Facilitator") {
        setFacilitator("Project Facilitator");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints + 2);
        }
      } else {
        setAssistants("Project Assistants");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints + 1);
        }
      }
    } else {
      if (value === "Project Leader") {
        setLeader("");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints - 3);
        }
      } else if (value === "Project Coordinator") {
        setCoordinator("");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints - 2.5);
        }
      } else if (value === "Project Facilitator") {
        setFacilitator("");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints - 2);
        }
      } else {
        setAssistants("");
        if (
          extensionActivityFile ||
          extensionWorkload?.extensionActivityFilename
        ) {
          setDesignationActivityPoints(designationActivityPoints - 1);
        }
      }
    }
  };

  useEffect(() => {
    if (leader) {
      if (
        extensionActivityFile ||
        extensionWorkload?.extensionActivityFilename
      ) {
        setDesignationActivityPoints(designationActivityPoints + 3);
      } else {
        setDesignationActivityPoints(designationActivityPoints - 3);
      }
    } else if (coordinator) {
      if (
        extensionActivityFile ||
        extensionWorkload?.extensionActivityFilename
      ) {
        setDesignationActivityPoints(designationActivityPoints + 2.5);
      } else {
        setDesignationActivityPoints(designationActivityPoints - 2.5);
      }
    } else if (facilitator) {
      if (
        extensionActivityFile ||
        extensionWorkload?.extensionActivityFilename
      ) {
        setDesignationActivityPoints(designationActivityPoints + 2);
      } else {
        setDesignationActivityPoints(designationActivityPoints - 2);
      }
    } else if (assistants) {
      if (
        extensionActivityFile ||
        extensionWorkload?.extensionActivityFilename
      ) {
        setDesignationActivityPoints(designationActivityPoints + 1);
      } else {
        setDesignationActivityPoints(designationActivityPoints - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionActivityFile, extensionWorkload?.extensionActivityFilename]);

  useEffect(() => {
    setDesignationExtensionActivity(
      [leader, coordinator, facilitator, assistants].filter(Boolean)
    );
  }, [leader, coordinator, facilitator, assistants]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const {
        teachingWorkloads,
        extensionWorkloads,
        researchWorkloads,
        strategicFunctionWorkloads
      } = await GetAllUserPendingWorkloads(user.email);
      actions.setHasPendingTeachingWorkload(
        !!teachingWorkloads.length && teachingWorkloads[0].isSubmitted
      );
      actions.setHasPendingExtensionWorkload(
        !!extensionWorkloads.length && extensionWorkloads[0].isSubmitted
      );
      actions.setHasPendingResearchWorkload(
        !!researchWorkloads.length && researchWorkloads[0].isSubmitted
      );
      actions.setHasPendingStrategicWorkload(
        !!strategicFunctionWorkloads.length &&
          strategicFunctionWorkloads[0].isSubmitted
      );
      const { data } = await getEwlSavedWorkload(user.id);
      setExtensionWorkload(data);
      setDesignationExtensionActivity(data.designationExtensionActivity);
      if (data.designationExtensionActivity) {
        let designationPoints = 0;
        if (data.designationExtensionActivity?.includes("Project Leader")) {
          setLeader("Project Leader");
          designationPoints += 3;
        }
        if (
          data.designationExtensionActivity?.includes("Project Coordinator")
        ) {
          setCoordinator("Project Coordinator");
          designationPoints += 2.5;
        }
        if (
          data.designationExtensionActivity?.includes("Project Facilitator")
        ) {
          setFacilitator("Project Facilitator");
          designationPoints += 2;
        }
        if (data.designationExtensionActivity?.includes("Project Assistants")) {
          setAssistants("Project Assistants");
          designationPoints += 1;
        }
        setDesignationActivityPoints(designationPoints);
      }

      setTotalNumberHours(data.totalNumberHours);

      if (data.resourcePerson) {
        for (let a = 0; a < data.resourcePerson.length!; a++) {
          if (data.resourcePerson[a] === "International") {
            if (a === 0) {
              setResourcePersonPoints(4);
            } else if (a === 1) {
              setResourcePersonPoints1(4);
            } else if (a === 2) {
              setResourcePersonPoints2(4);
            }
          } else if (data.resourcePerson[a] === "National") {
            if (a === 0) {
              setResourcePersonPoints(3);
            } else if (a === 1) {
              setResourcePersonPoints1(3);
            } else if (a === 2) {
              setResourcePersonPoints2(3);
            }
          } else if (data.resourcePerson[a] === "Regional") {
            if (a === 0) {
              setResourcePersonPoints(2);
            } else if (a === 1) {
              setResourcePersonPoints1(2);
            } else if (a === 2) {
              setResourcePersonPoints2(2);
            }
          } else if (data.resourcePerson[a] === "Local") {
            if (a === 0) {
              setResourcePersonPoints(1);
            } else if (a === 1) {
              setResourcePersonPoints1(1);
            } else if (a === 2) {
              setResourcePersonPoints2(1);
            }
          }
        }
      }
      setIsLoading(false);
    })();
  }, [actions, user.email, user.id]);

  const onRemoveExtensionFile = () => {
    setExtensionActivityFile(undefined);
    setExtensionWorkload({
      ...extensionWorkload,
      extensionActivityFilename: undefined
    });
  };

  const onRemoveSummaryFile = () => {
    setSummaryOfHoursFile(undefined);
    setExtensionWorkload({
      ...extensionWorkload,
      summaryOfHoursFilename: undefined
    });
  };

  const onRemoveCertificateFile = () => {
    const arr = extensionWorkload?.certificateFilenames;
    arr![0] = "";
    setCertificateFile(undefined);
    setExtensionWorkload({
      ...extensionWorkload,
      certificateFilenames: arr
    });
  };

  const onRemoveCertificateFile1 = () => {
    const arr = extensionWorkload?.certificateFilenames;
    arr![1] = "";
    setCertificateFile1(undefined);
    setExtensionWorkload({
      ...extensionWorkload,
      certificateFilenames: arr
    });
  };

  const onRemoveCertificateFile2 = () => {
    const arr = extensionWorkload?.certificateFilenames;
    arr![2] = "";
    setCertificateFile2(undefined);
    setExtensionWorkload({
      ...extensionWorkload,
      certificateFilenames: arr
    });
  };

  return (
    <MainContainer>
      <Confirm
        open={isConfirming}
        onCancel={() => setIsConfirming(false)}
        onConfirm={extensionWorkloadHandler}
        content="Confirm saving of workload?"
        size="large"
      />
      <TopNav profileHandler={() => setIsProfileOpen(!isProfileOpen)} />

      <ProfileTab isProfileOpen={isProfileOpen} UseLogout={UseLogout} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minHeight: "100vh" }}>
          <Menu position="relative" />
        </div>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              marginTop: 500,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <LoadingSpinner color={Colors.primary} />
          </div>
        ) : (
          <BodyContainer>
            <ScreenTitle title="Faculty Workload" />
            <WorkloadTextContainer>
              <WorkloadText>{WorkloadType.EXTENSION_WORKLOAD}</WorkloadText>
            </WorkloadTextContainer>
            <Container>
              <SubContainer>
                <WorkloadTextContainer style={{ marginTop: 10 }}>
                  <WorkloadText>
                    Hours Rendered In Extension Activities
                  </WorkloadText>
                </WorkloadTextContainer>
                <div style={{ display: "flex", padding: 20, paddingTop: 0 }}>
                  <InputsContainer
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: 40,
                      marginRight: 15
                    }}
                  >
                    <Label>
                      Total Number of Hours Rendered in Extension Activities
                    </Label>
                    <TextInput
                      type="number"
                      onChange={e => totalNumberHoursHandler(e.target.value)}
                      value={totalNumberHours}
                      min={0}
                      style={{
                        border: "1px solid black"
                      }}
                    />
                  </InputsContainer>
                  <InputsContainer
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: 40,
                      marginLeft: 15
                    }}
                  >
                    <UploadTextDescription>
                      Upload Summary of hours rendered in extension activities:
                    </UploadTextDescription>
                    <UploadFileButton
                      fileHandler={setSummaryOfHoursFileHandler}
                      workloadFileName={
                        summaryOfHoursFile?.name ||
                        extensionWorkload?.summaryOfHoursFilename
                      }
                      onRemoveFile={onRemoveSummaryFile}
                    />
                  </InputsContainer>
                </div>
                <Label style={{ fontWeight: "bold", marginLeft: 15 }}>
                  Points:{" "}
                </Label>
                <span>
                  {(!summaryOfHoursFile &&
                    !extensionWorkload?.summaryOfHoursFilename) ||
                  !totalNumberHours
                    ? 0
                    : Number(totalNumberHours) * 0.05556 >= 3
                    ? 3
                    : Number((Number(totalNumberHours) * 0.05556).toFixed(2))}
                </span>
              </SubContainer>
            </Container>
            <Container>
              <SubContainer>
                <WorkloadTextContainer style={{ marginTop: 10 }}>
                  <WorkloadText>
                    Additional Workload Points for Extension
                  </WorkloadText>
                </WorkloadTextContainer>
                <div
                  style={{
                    padding: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                  }}
                >
                  <InputsContainer style={{ width: "100%" }}>
                    <DesignationExtensionActivity
                      onChangeValueCheckbox={onChangeValueCheckbox}
                      designationExtensionActivity={
                        designationExtensionActivity
                      }
                    />
                  </InputsContainer>
                  <div
                    style={{
                      display: "flex",
                      alignSelf: "flex-start",
                      width: "100%"
                    }}
                  >
                    <InputsContainer
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        marginTop: 40
                      }}
                    >
                      <UploadTextDescription>
                        Upload Extension Activity Accomplishment Report here:
                      </UploadTextDescription>
                      <UploadFileButton
                        fileHandler={setExtensionActivityFileHandler}
                        workloadFileName={
                          extensionActivityFile?.name ||
                          extensionWorkload?.extensionActivityFilename
                        }
                        onRemoveFile={onRemoveExtensionFile}
                      />
                    </InputsContainer>
                  </div>
                </div>
                <Label style={{ fontWeight: "bold", marginLeft: 15 }}>
                  Points:{" "}
                </Label>
                <span>{designationActivityPoints || 0}</span>
              </SubContainer>
              <SubContainer style={{ marginTop: 60 }}>
                <WorkloadTextContainer style={{ marginTop: 10 }}>
                  <WorkloadText>
                    Resource Person in Extension Activities
                  </WorkloadText>
                </WorkloadTextContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 20
                  }}
                >
                  <ResourcePersonContainer>
                    <InputsContainer>
                      <Dropdown
                        option={DROPDOWN_LISTS.RESOURCE_PERSON}
                        label="Resource Person in an Extension Activity"
                        onSelect={resourcePersonHandler}
                        val={
                          resourcePerson ||
                          extensionWorkload?.resourcePerson?.[0]
                        }
                      />
                    </InputsContainer>
                    <UploadContainer>
                      <UploadTextDescription>
                        Upload certificate of presentation here:
                      </UploadTextDescription>
                      <UploadFileContainer>
                        <UploadFileButton
                          fileHandler={setCertificateFileHandler}
                          workloadFileName={
                            certificateFile?.name ||
                            extensionWorkload?.certificateFilenames?.[0]
                          }
                          onRemoveFile={onRemoveCertificateFile}
                        />
                      </UploadFileContainer>
                    </UploadContainer>
                  </ResourcePersonContainer>
                  <ResourcePersonContainer>
                    <InputsContainer>
                      <Dropdown
                        option={DROPDOWN_LISTS.RESOURCE_PERSON}
                        onSelect={resourcePersonHandler1}
                        val={
                          resourcePerson1 ||
                          extensionWorkload?.resourcePerson?.[1]
                        }
                      />
                    </InputsContainer>
                    <UploadContainer>
                      <UploadFileContainer>
                        <UploadFileButton
                          fileHandler={setCertificateFileHandler1}
                          workloadFileName={
                            certificateFile1?.name ||
                            extensionWorkload?.certificateFilenames?.[1]
                          }
                          onRemoveFile={onRemoveCertificateFile1}
                        />
                      </UploadFileContainer>
                    </UploadContainer>
                  </ResourcePersonContainer>
                  <ResourcePersonContainer>
                    <InputsContainer>
                      <Dropdown
                        option={DROPDOWN_LISTS.RESOURCE_PERSON}
                        onSelect={resourcePersonHandler2}
                        val={
                          resourcePerson2 ||
                          extensionWorkload?.resourcePerson?.[2]
                        }
                      />
                    </InputsContainer>
                    <UploadContainer>
                      <UploadFileContainer>
                        <UploadFileButton
                          fileHandler={setCertificateFileHandler2}
                          workloadFileName={
                            certificateFile2?.name ||
                            extensionWorkload?.certificateFilenames?.[2]
                          }
                          onRemoveFile={onRemoveCertificateFile2}
                        />
                      </UploadFileContainer>
                    </UploadContainer>
                  </ResourcePersonContainer>
                </div>
                <Label style={{ fontWeight: "bold", marginLeft: 15 }}>
                  Points:{" "}
                </Label>
                <span>{resourcePersonActivityPoints || 0}</span>
              </SubContainer>
              <ButtonContainer>
                <div>
                  <Label style={{ fontWeight: "bold" }}>
                    Total Extension Workload ={" "}
                    {(
                      designationActivityPoints +
                      resourcePersonActivityPoints +
                      ((!summaryOfHoursFile &&
                        !extensionWorkload?.summaryOfHoursFilename) ||
                      !totalNumberHours
                        ? 0
                        : Number(totalNumberHours) * 0.05556 >= 3
                        ? 3
                        : Number(
                            (Number(totalNumberHours) * 0.05556).toFixed(2)
                          ))
                    ).toString()}
                  </Label>
                </div>
                <FormButton
                  text="Save"
                  onClicked={() => setIsConfirming(true)}
                  isSubmitting={isSubmitting}
                  disabled={
                    (!designationExtensionActivity &&
                      !extensionActivityFile?.name &&
                      !resourcePerson &&
                      !certificateFile &&
                      !totalNumberHours &&
                      !summaryOfHoursFile?.name) ||
                    isSubmitting
                  }
                ></FormButton>
              </ButtonContainer>
            </Container>
          </BodyContainer>
        )}
      </div>

      <FooterContainer>
        <Footer />
      </FooterContainer>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BodyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 5px solid black;
  border-radius: 15px;
  margin: 120px 50px;
  width: 100%;
`;

const Container = styled.div`
  padding: 30px;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 90%;
`;

const SubContainer = styled.div`
  border: 2px solid black;
  width: 100%;
  height: auto;
  border-radius: 15px;
  padding: 15px;
`;

const WorkloadTextContainer = styled.div`
  display: flex;
  align-self: flex-start;
  margin-left: 20px;
`;

const WorkloadText = styled.span`
  font-size: 19px;
  font-weight: 600;
  line-height: 20px;
  font-family: HurmeGeometricSans3;
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const UploadContainer = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

const UploadTextDescription = styled.label`
  font-weight: 400;
  font-size: 17px;
  line-height: 18px;
  font-family: HurmeGeometricSans3;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 20px 0px 0px;
  width: 100%;
`;

const UploadFileContainer = styled.div`
  max-width: 100px;
`;

const Label = styled.label`
  font-size: 15px;
  font-family: HurmeGeometricSans3;
  align-self: flex-start;
  font-weight: 400;
`;

const TextInput = styled.input`
  max-width: 100px;
`;

const FooterContainer = styled.div`
  margin-top: auto;
  align-self: flex-end;
  width: 100%;
  z-index: 1;
`;

const ResourcePersonContainer = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
`;

export default ExtensionWorkload;
