import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import Grid from "@mui/material/Grid";
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FloatingChatIcon from "../../components/FloatingChatIcon";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import * as util from "../../services/utilService";
import { useNavigate } from "react-router-dom";
import SearchBox from "components/search";
import ContinueLearning from "./continueLearning";
import SelectPreference from "pages/SelectPreference";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import _ from "lodash";
import Modal from "@mui/material/Modal";
const designations = require("../../configs/designations.json");
const urlConfig = require("../../configs/urlConfig.json");
import ToasterCommon from "../ToasterCommon";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import DomainVerificationOutlinedIcon from "@mui/icons-material/DomainVerificationOutlined";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import LearningHistory from "./learningHistory";
import Certificate from "./certificate";
const routeConfig = require("../../configs/routeConfig.json");

const DELAY = 1500;
const MAX_CHARS = 500;
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "4px",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [certData, setCertificateCountData] = useState({});
  const [courseData, setCourseCountData] = useState({});
  const navigate = useNavigate();
  const _userId = util.userId();
  const [openModal, setOpenModal] = useState(false);
  const [isEmptyPreference, setIsEmptyPreference] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const axios = require("axios");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({
    firstName: userData?.result?.response?.firstName || "",
    lastName: userData?.result?.response?.lastName || "",
    bio: "",
    designation: "",
    otherDesignation: "",
  });
  const [originalUserInfo, setOriginalUserInfo] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [designationsList, setDesignationsList] = useState([]);
  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasterOpen, setToasterOpen] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [rootOrgId, setRootOrgId] = useState();
  const [domain, setDomain] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const showErrorMessage = (msg) => {
    setToasterMessage(msg);
    setTimeout(() => {
      setToasterMessage("");
    }, 2000);
    setToasterOpen(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, DELAY);
    setDesignationsList(designations);
  }, []);

  useEffect(() => {
    if (userData?.result?.response && userInfo) {
      setEditedUserInfo({
        firstName: userData?.result?.response.firstName,
        lastName: userData?.result?.response.lastName,
        bio: userInfo[0]?.bio,
        designation: userInfo[0]?.designation,
        otherDesignation: "",
      });
      setOriginalUserInfo({
        firstName: userData?.result?.response.firstName,
        lastName: userData?.result?.response.lastName,
        bio: userInfo[0]?.bio,
        designation: userInfo[0]?.designation,
        otherDesignation: "",
      });
    }
    setDomain(userData?.result?.response.framework.board);
    setSubDomain(userData?.result?.response.framework.gradeLevel);
  }, [userData, userInfo]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setDesignationsList(designations);
    const fetchCertificateCount = async () => {
      try {
        const url = `${urlConfig.URLS.POFILE_PAGE.CERTIFICATE_COUNT}?user_id=${_userId}`;

        const response = await fetch(url);
        const data = await response.json();
        setCertificateCountData({
          totalCourses: data.result.courseWithCertificate,
          certificatesReceived: data.result.certificateReceived,
        });
      } catch (error) {
        console.error("Error fetching certificate count:", error);
        showErrorMessage(t("FAILED_TO_FETCH_CERT_COUNT"));
      }
    };

    const fetchCourseCount = async () => {
      try {
        const url = `${urlConfig.URLS.POFILE_PAGE.COURSE_COUNT}?user_id=${_userId}`;

        const response = await fetch(url);
        const data = await response.json();
        setCourseCountData({
          enrolledThisMonth: data.result.enrolledThisMonth,
          enrolledLastMonth: data.result.enrolledLastMonth,
        });
      } catch (error) {
        console.error(error);
        showErrorMessage(t("FAILED_TO_FETCH_COURSE_COUNT"));
      }
    };
    const fetchUserInfo = async () => {
      try {
        const url = `${urlConfig.URLS.POFILE_PAGE.USER_READ}`;
        const response = await axios.post(
          url,
          { user_ids: [_userId] },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUserInfo(response?.data?.result);
      } catch (error) {
        console.error(error);
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
      }
    };

    fetchData();
    fetchCertificateCount();
    fetchCourseCount();
    fetchUserInfo();
    fetchUserDataAndSetCustodianOrgData();
  }, []);

  const fetchUserDataAndSetCustodianOrgData = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.SYSTEM_SETTING.CUSTODIAN_ORG}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch custodian organization ID");
      }
      const data = await response.json();
      const custodianOrgId = data?.result?.response?.value;
      const rootOrgId = sessionStorage.getItem("rootOrgId");

      if (custodianOrgId === rootOrgId) {
        const url = `${urlConfig.URLS.PUBLIC_PREFIX}${urlConfig.URLS.CHANNEL.READ}/${custodianOrgId}`;
        const response = await fetch(url);
        const data = await response.json();
        const defaultFramework = data?.result?.channel?.defaultFramework;
        localStorage.setItem("defaultFramework", defaultFramework);
      } else {
        const url = `${urlConfig.URLS.PUBLIC_PREFIX}${urlConfig.URLS.CHANNEL.READ}/${rootOrgId}`;
        const response = await fetch(url);
        const data = await response.json();
        const defaultFramework = data?.result?.channel?.defaultFramework;
        localStorage.setItem("defaultFramework", defaultFramework);
      }
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo({
      ...editedUserInfo,
      [name]: value,
    });
    setIsFormDirty(true);
  };
  const handleOpenEditDialog = () => {
    setIsEditing(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditing(false);
  };
  const updateUserData = async () => {
    setIsLoading(true);
    setError(null);
    const requestBody = {
      params: {},
      request: {
        firstName: editedUserInfo.firstName,
        lastName: editedUserInfo.lastName,
        userId: _userId,
      },
    };

    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.UPDATE_USER_PROFILE}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      await updateUserInfoInCustomDB();
      console.log("responseData", responseData);
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };
  const updateUserInfoInCustomDB = async () => {
    const requestBody = {
      designation:
        editedUserInfo.designation === "Other"
          ? editedUserInfo.otherDesignation
          : editedUserInfo.designation,
      bio: editedUserInfo.bio,
      created_by: _userId,
    };
    try {
      const url = `${urlConfig.URLS.POFILE_PAGE.USER_UPDATE}?user_id=${_userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        showErrorMessage(t("SOMETHING_WENT_WRONG"));
        throw new Error(t("SOMETHING_WENT_WRONG"));
      }

      const data = await response.json();
    } catch (error) {
      showErrorMessage(t("SOMETHING_WENT_WRONG"));
    } finally {
      setIsLoading(false);
    }
  };
  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await updateUserData();
    // Close the edit dialog
    setIsEditing(false);
    window.location.reload();
    setIsFormDirty(false);
  };

  const fetchData = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.GET_PROFILE}${_userId}?fields=${urlConfig.params.userReadParam.fields}`;

      const header = "application/json";
      const response = await fetch(url, {
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
      const data = await response.json();
      setUserData(data);
      const rootOrgId = data.result.response.rootOrgId;
      sessionStorage.setItem("rootOrgId", rootOrgId);
      setRootOrgId(rootOrgId);
      console.log("rootOrgId", rootOrgId);
      if (_.isEmpty(data?.result?.response.framework)) {
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };

  const handleLearningHistoryClick = () => {
    navigate(routeConfig.ROUTES.CONTINUE_LEARNING_PAGE.CONTINUE_LEARNING);
  };

  const handleContinueLearningClick = () => {
    navigate(routeConfig.ROUTES.CONTINUE_LEARNING_PAGE.CONTINUE_LEARNIN);
  };

  const handleCertificateButtonClick = () => {
    if (isMobile) {
      navigate(routeConfig.ROUTES.CERTIFICATE_PAGE.CERTIFICATE);
    } else {
      setIsButtonDisabled(true);
      setShowCertificate(true);
    }
  };

  const handleSearch = (query) => {
    // Implement your search logic here
    console.log("Search query:", query);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchData();
    window.location.reload();
  };

  return (
    <div>
      <Header />
      {toasterMessage && <ToasterCommon response={toasterMessage} />}

      <Container maxWidth="xxl" role="main" className="xs-p-0 xs-pb-75 pt-1">
        {error && (
          <Alert severity="error" className="my-10">
            {error}
          </Alert>
        )}

        <Grid container spacing={2} className="pt-8">
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            className="sm-p-25 left-container profile lg-mt-12"
          >
            <Box sx={{ fontSize: "18px", color: "#484848" }}>
              {t("MY_PROFILE")}
            </Box>

            <Box
              textAlign="center"
              padding="10"
              sx={{ marginTop: "22px" }}
              className="xs-pr-16 mb-10"
            >
              <Box className="grey-bx">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "20px 10px 0",
                  }}
                >
                  {userData && (
                    <>
                      <div className="img-text-circle">
                        {userData?.result?.response?.firstName[0]}
                      </div>
                    </>
                  )}
                  <CardContent className="profile-cardContent">
                    {userData && (
                      <>
                        <Box className="d-flex jc-bw mb-10 alignItems-center">
                          <Box>
                            <Typography className="h4-title">
                              {userData?.result?.response?.firstName}{" "}
                              {userData?.result?.response?.lastName}
                            </Typography>
                            <Typography className="h6-title d-flex">
                              {userInfo?.length &&
                                userInfo?.[0]?.designation && (
                                  <>{userInfo[0].designation} </>
                                )}
                              <Box className="cardLabelEllips">
                                {userInfo?.length &&
                                  userInfo?.[0]?.designation &&
                                  "   | "}{" "}
                                ID: {userData?.result?.response?.userName}{" "}
                                {
                                  userData?.result?.response?.organisations
                                    ?.orgName
                                }
                              </Box>
                            </Typography>
                          </Box>

                          <ModeEditIcon onClick={handleOpenEditDialog} />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Box>
                {userData && userInfo?.length > 0 && (
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                    style={{ fontSize: "12px", padding: "0 20px" }}
                  >
                    {userInfo?.length ? userInfo[0]?.bio : ""}
                  </Typography>
                )}

                <Box className="mb-15 mt-20">
                  <Box
                    className="d-flex jc-bw"
                    sx={{
                      flexDirection: "row",
                      padding: "0 0 12px 15px",
                    }}
                  >
                    <Box
                      style={{
                        alignItems: "center",
                      }}
                      className="h4-title d-flex fw-400"
                    >
                      <EmojiEventsOutlinedIcon
                        style={{ paddingRight: "10px" }}
                      />{" "}
                      {t("PERFORMANCE")}
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={3}
                      md={3}
                      className="circular"
                      style={{ paddingRight: "0", textAlign: "right" }}
                    >
                      {certData &&
                        certData.certificatesReceived &&
                        certData.totalCourses && (
                          <CircularProgressWithLabel
                            received={certData.certificatesReceived}
                            total={certData.totalCourses}
                            className="circular"
                            style={{ width: "80px", height: "80px" }}
                          />
                        )}
                    </Grid>
                    <Grid item xs={3} md={3} className="circular">
                      <Typography
                        style={{
                          margin: "9px 10px 9px 0",
                          display: "block",
                          textAlign: "left",
                        }}
                        className="fs-12 text-yellow"
                      >
                        {t("CERTIFICATIONS_RECEIVED")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={3}
                      className="circularBlue"
                      style={{ paddingRight: "0", textAlign: "right" }}
                    >
                      {courseData && (
                        <CircularProgressWithLabel
                          received={courseData.enrolledThisMonth}
                          total={courseData.enrolledLastMonth}
                          className="circular"
                          style={{ width: "80px", height: "80px" }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={4} md={3}>
                      <Typography
                        variant="h7"
                        style={{
                          margin: "9px 0",
                          display: "block",
                          textAlign: "left",
                          paddingLeft: "7px",
                          marginRight: "10px",
                        }}
                        className="fs-12 text-blueShade0"
                      >
                        {t("COURSES_THAN")}

                        <span style={{ color: "#00A2D5", paddingLeft: "5px" }}>
                          {t("LAST_MONTH")}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {isEditing && (
                  <Modal
                    // open={open}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="xs-w-300"
                    open={isEditing}
                    onClose={handleCloseEditDialog}
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        className="h3-title"
                        style={{ marginBottom: "20px" }}
                      >
                        {t("EDIT_PROFILE")}
                      </Typography>
                      <form onSubmit={handleFormSubmit}>
                        <Box py={1}>
                          <CssTextField
                            id="firstName"
                            name="firstName"
                            label={<span>First Name</span>}
                            variant="outlined"
                            size="small"
                            value={editedUserInfo.firstName}
                            onChange={(e) =>
                              setEditedUserInfo({
                                ...editedUserInfo,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </Box>
                        <Box py={1}>
                          <CssTextField
                            id="lastName"
                            name="lastName"
                            label={<span>Last Name</span>}
                            variant="outlined"
                            size="small"
                            value={editedUserInfo.lastName}
                            onChange={(e) =>
                              setEditedUserInfo({
                                ...editedUserInfo,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </Box>

                        <Box py={1}>
                          <FormControl fullWidth style={{ marginTop: "10px" }}>
                            <InputLabel
                              id="designation-label"
                              className="year-select"
                            >
                              {" "}
                              {t("DESIGNATION")}{" "}
                            </InputLabel>
                            <Select
                              labelId="designation-label"
                              id="designation"
                              value={editedUserInfo.designation}
                              onChange={(e) =>
                                setEditedUserInfo({
                                  ...editedUserInfo,
                                  designation: e.target.value,
                                })
                              }
                            >
                              {designationsList.map((desig, index) => (
                                <MenuItem key={index} value={desig}>
                                  {desig}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        {editedUserInfo.designation === "Other" && (
                          <Box py={1}>
                            <CssTextField
                              id="otherDesignation"
                              name="otherDesignation"
                              label={
                                <span>
                                  {t("OTHER_DESIGNATION")}{" "}
                                  <span className="required">*</span>
                                </span>
                              }
                              variant="outlined"
                              size="small"
                              value={editedUserInfo.otherDesignation}
                              onChange={(e) =>
                                setEditedUserInfo({
                                  ...editedUserInfo,
                                  otherDesignation: e.target.value,
                                })
                              }
                            />
                          </Box>
                        )}
                        <Box py={2}>
                          <TextField
                            id="bio"
                            name="bio"
                            label={<span>{t("BIO")}</span>}
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            value={editedUserInfo.bio}
                            onChange={(e) =>
                              setEditedUserInfo({
                                ...editedUserInfo,
                                bio: e.target.value,
                              })
                            }
                            inputProps={{ maxLength: MAX_CHARS }}
                          />
                          <Typography
                            variant="caption"
                            color={
                              editedUserInfo.bio?.length > MAX_CHARS
                                ? "error"
                                : "textSecondary"
                            }
                          >
                            {editedUserInfo.bio ? editedUserInfo.bio.length : 0}
                            /{MAX_CHARS}
                          </Typography>
                        </Box>

                        <Box pt={4} className="d-flex jc-en">
                          <Button
                            className="custom-btn-default mr-5"
                            onClick={handleCloseEditDialog}
                          >
                            {t("CANCEL")}
                          </Button>
                          <Button className="custom-btn-primary " type="submit">
                            {t("SAVE")}
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  </Modal>
                )}
              </Box>
              <Button
                type="button"
                className="my-30"
                onClick={handleCertificateButtonClick}
                disabled={isButtonDisabled}
                style={{
                  backgroundColor: isButtonDisabled ? "gray" : "#0E7A9C",
                  borderRadius: "30px",
                  color: "#fff",
                  padding: "10px 25px",
                  fontWeight: " 500",
                  fontSize: "12px",
                }}
              >
                <ReceiptLongIcon className="pr-5" />
                {t("Download Certificates")}
              </Button>

              <Modal
                // open={open}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                isableEscapeKeyDown={!isEmptyPreference}
                open={openModal}
                className="xs-w-300"
                onClose={(event, reason) => {
                  if (
                    reason === "backdropClick" ||
                    reason === "escapeKeyDown"
                  ) {
                    setOpenModal(true);
                  } else {
                    handleCloseModal();
                  }
                }}
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    className="h3-title"
                    style={{ marginBottom: "20px" }}
                  >
                    {t("SELECT_PREFERENCE")}
                  </Typography>
                  <SelectPreference onClose={handleCloseModal} />
                </Box>
              </Modal>

              <Box className="grey-bx p-10 py-15">
                <Box className="h4-title d-flex pt-10 alignItems-center">
                  <SettingsOutlinedIcon className="pr-5 fw-400" />
                  <Box>{t("USER_PREFERENCES")}</Box>
                </Box>
                <Box className="mb-20">
                  <Box className="h5-title mt-15 mb-10">
                    <span className="fw-400"> {t("DOMAIN")} </span> :{" "}
                    <span className="fw-600">{domain}</span>
                  </Box>
                  <Box className="h5-title">
                    <span className="fw-400"> {t("SUB_DOMAIN")} </span>:{" "}
                    <span className="fw-600"> {subDomain}</span>
                  </Box>
                </Box>
                <Box className="text-center">
                  <Button
                    type="button"
                    className="custom-btn-primary my-10"
                    onClick={handleOpenModal}
                  >
                    {t("CHANGE_PREFERENCES")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8} lg={8} className="xs-pl-0 pb-20">
            {showCertificate ? (
              <Certificate />
            ) : (
              <div>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label="Continue learning"
                        className="tab-text profile-tab"
                        icon={<DomainVerificationOutlinedIcon />}
                        value="1"
                      />
                      <Tab
                        label="Learning History"
                        className="tab-text profile-tab"
                        icon={<WatchLaterOutlinedIcon />}
                        value="2"
                        // onClick={handleLearningHistoryClick}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <ContinueLearning />
                  </TabPanel>
                  <TabPanel value="2">
                    <LearningHistory />
                  </TabPanel>
                </TabContext>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
      <FloatingChatIcon />
      <Footer />
    </div>
  );
};

export default Profile;
