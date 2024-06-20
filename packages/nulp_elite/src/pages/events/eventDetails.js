import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import FloatingChatIcon from "../../components/FloatingChatIcon";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";

import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import AccessAlarmsOutlinedIcon from "@mui/icons-material/AccessAlarmsOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import * as util from "../../services/utilService";
const EventDetailResponse = require("./detail.json");
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ToasterCommon from "../ToasterCommon";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import axios from "axios";

const urlConfig = require("../../configs/urlConfig.json");

import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";
import AddConnections from "pages/connections/AddConnections";
import { Button } from "native-base";
import { maxWidth } from "@shiksha/common-lib";
const EventDetails = () => {
  const { eventId } = useParams();
  const _userId = util.userId()
    ? util.userId()
    : "44e13b6a-e5d2-4b23-89fe-c80c4880abcb"; // Assuming util.userId() is defined

  const shareUrl = window.location.href; // Current page URL
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterOpen, setToasterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [detailData, setDetailDate] = useState();
  const [userCourseData, setUserCourseData] = useState({});
  const [userInfo, setUserInfo] = useState();
  const [creatorInfo, setCreatorInfo] = useState();
  const [batchData, setBatchData] = useState();
  const [enrolled, setEnrolled] = useState();
  const [canEnroll, setCanEnroll] = useState();
  const [canJoin, setCanJoin] = useState();
  const [isRecorded, setIsRecorded] = useState();
  const [isEnrolled, setIsEnrolled] = useState();
  const [showEnrollmentSnackbar, setShowEnrollmentSnackbar] = useState(false);

  const { t } = useTranslation();
  const showErrorMessage = (msg) => {
    setToasterMessage(msg);
    setTimeout(() => {
      setToasterMessage("");
    }, 2000);
    setToasterOpen(true);
  };
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const unixTimestampToHumanDate = (unixTimestamp) => {
    const dateObject = new Date(unixTimestamp);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return dateObject.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${urlConfig.URLS.PUBLIC_PREFIX}${urlConfig.URLS.EVENT.READ}/${eventId}`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs",
          },
        });
        if (!response.ok) {
          showErrorMessage(t("FAILED_TO_FETCH_DATA"));
          throw new Error(t("FAILED_TO_FETCH_DATA"));
        }
        const data = await response.json();
        console.log("event data---", data);
        setDetailDate(data.result.event);
        getUserData(data.result.event.owner, "creator");
        handleEnrollUnenrollBtn(
          data.result.event.registrationStartDate,
          data.result.event.registrationEndDate
        );
        handleJoinEventBtn(
          data.result.event.startDate,
          data.result.event.startTime,
          data.result.event.endDate,
          data.result.event.endTime
        );
      } catch (error) {
        console.error("Error fetching course data:", error);
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
      }
    };

    fetchData();
    fetchBatchData();
    checkEnrolledCourse();
    getUserData(_userId, "loggedIn");
    setIsEnrolled(isEnrolledCheck());
    console.log("isEnrolled---", isEnrolledCheck());
  }, []);
  const isEnrolledCheck = () => {
    console.log("userCourseData----", userCourseData);
    return (
      userCourseData &&
      userCourseData.courses &&
      userCourseData.courses.some((course) => course.contentId === eventId)
    );
  };

  const fetchBatchData = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.BATCH.GET_BATCHS}`;
      const response = await axios.post(url, {
        request: {
          filters: {
            courseId: eventId,
            enrollmentType: "open",
          },
          sort_by: {
            createdDate: "desc",
          },
        },
      });
      const responseData = response.data;
      console.log("responseData------", responseData.result.response.content);
      if (responseData.result.response) {
        if (responseData.result.response.count === 0) {
          // console.warn("This course has no active batches.");
          showErrorMessage(t("This course has no active Batches")); // Assuming `showErrorMessage` is used to display messages to the user
        } else if (
          responseData.result.response.content &&
          responseData.result.response.content.length >= 0
        ) {
          const batchDetails = responseData.result.response.content[0];
          // setBatchData(responseData.result.response.content[0])
          console.log("batchDetails-----", batchDetails);
          setBatchData({
            startDate: batchDetails.startDate,
            endDate: batchDetails.endDate,
            enrollmentEndDate: batchDetails.enrollmentEndDate,
            batchId: batchDetails.batchId,
          });
        } else {
          console.error("Batch data not found in response");
        }
      } else {
        console.error("Batch data not found in response");
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };
  const checkEnrolledCourse = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.COURSE.GET_ENROLLED_COURSES}/${_userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }
      const data = await response.json();
      console.log("enrollment data ---", data.result.courses);
      setUserCourseData(data.result.courses);
    } catch (error) {
      console.error("Error while fetching courses:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };
  const handleGoBack = () => {
    navigate(-1); // Navigate back in history
  };

  const formatTimeToIST = (timeString) => {
    // Check if the timeString is a full date-time string
    let dateObject = new Date(timeString);

    // If it is not a valid date, assume it is just a time string (e.g., "14:30")
    if (isNaN(dateObject.getTime())) {
      const [hours, minutes] = timeString.split(":");
      dateObject = new Date();
      dateObject.setHours(hours);
      dateObject.setMinutes(minutes);
      dateObject.setSeconds(0);
    }

    // Convert the date to IST
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    return dateObject.toLocaleTimeString("en-GB", options);
  };
  const getUserData = async (userId, userType) => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.GET_PROFILE}${userId}?fields=${urlConfig.params.userReadParam.fields}`;

      const response = await fetch(url);
      const data = await response.json();
      if (userType == "loggedIn") {
        setUserInfo(data.result.response);
      } else if (userType == "creator") {
        setCreatorInfo(data.result.response);
      }
    } catch (error) {
      console.error("Error while getting user data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };

  const enrollEvent = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.COURSE.ENROLL_USER_COURSE}`;
      const requestBody = {
        request: {
          courseId: detailData.identifier,
          userId: _userId,
          batchId: batchData?.batchId,
        },
      };
      const response = await axios.post(url, requestBody);
      if (response.status === 200) {
        setEnrolled(true);
        setShowEnrollmentSnackbar(true);
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
      showErrorMessage(t("FAILED_TO_ENROLL_INTO_COURSE"));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowEnrollmentSnackbar(false);
  };
  const formatDateForCompair = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const formatTimeWithTimezone = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = String(
      Math.floor(Math.abs(timezoneOffset) / 60)
    ).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
      2,
      "0"
    );
    const offsetSign = timezoneOffset >= 0 ? "+" : "-";

    return `${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
  };

  const handleEnrollUnenrollBtn = async (enrollmentstart, enrollmentEnd) => {
    const todayDate = formatDate(new Date());

    console.log("todayDate----", todayDate);
    console.log("enrollmentstart----", enrollmentstart);
    console.log("enrollmentEnd----", enrollmentEnd);

    if (
      new Date(enrollmentstart) <= new Date(todayDate) &&
      new Date(enrollmentEnd) >= new Date(todayDate)
    ) {
      setCanEnroll(true);
    } else {
      setCanEnroll(false);
    }
  };
  const handleJoinEventBtn = async (startDate, startTime, endDate, endTime) => {
    const todayDate = formatDate(new Date());
    const todayTime = formatTimeWithTimezone(new Date());
    console.log("todayDate----", todayDate);
    console.log("startDate----", startDate);
    console.log("startTime----", startTime);
    console.log("endDate----", endDate);
    console.log("endTime----", endTime);
    if (
      new Date(startDate) <= new Date(todayDate) &&
      new Date(endDate) >= new Date(todayDate)
    ) {
      setCanJoin(true);
    } else {
      setCanJoin(false);
    }

    if (Date(endDate) <= new Date(todayDate)) {
      setIsRecorded(true);
    }
  };

  const attendWebinar = async () => {
    const url = detailData.onlineProviderData.meetingLink; // Replace with your URL
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div>
      <Header />
      {toasterMessage && <ToasterCommon response={toasterMessage} />}
      <Snackbar
        open={showEnrollmentSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ mt: 2 }}
        >
          {t("ENROLLMENT_SUCCESS_MESSAGE")}
        </MuiAlert>
      </Snackbar>
      {detailData && (
        <Container
          className=" xs-pr-0 xs-pb-20 mt-12"
          style={{
            maxWidth: "100%",
            paddingLeft: "14px",
            paddingRight: "14px",
            marginBottom: "20px",
          }}
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            className="h6-title mt-15 pl-28"
            style={{ padding: "0 0 20px 20px" }}
          >
            <Link
              underline="hover"
              style={{ maxHeight: "inherit" }}
              onClick={handleGoBack}
              color="#004367"
              href="/webapp/allevents"
            >
              {t("ALL_WEBINARS")}
            </Link>
            <Link
              underline="hover"
              href=""
              aria-current="page"
              className="h6-title oneLineEllipsis"
            >
              {detailData.name}
            </Link>
          </Breadcrumbs>
          <Grid
            container
            spacing={2}
            className="bg-whitee mt-20 custom-event-container mb-20"
          >
            <Grid item xs={3} md={6} lg={2}>
              {/* <img
              src={
                EventDetailResponse.appIcon
                  ? EventDetailResponse.appIcon
                  : require("assets/default.png")
              }
              className="event-card-img"
              alt="App Icon"
            /> */}
              <img
                src={require("assets/default.png")}
                className="eventCardImg"
                alt="App Icon"
              />
            </Grid>
            <Grid item xs={9} md={6} lg={6} className="lg-pl-60 xs-pl-30">
              <Typography gutterBottom className="mt-10  h1-title mb-20">
                {detailData.name}
              </Typography>
              <Box
                className="h5-title mb-20 xs-hide"
                style={{ fontWeight: "400" }}
              >
                National Urban Learning Platform{" "}
              </Box>
              <Box className="d-flex mb-20 alignItems-center xs-hide">
                <Box className="h5-title">Organised By:</Box>
                <Box className="d-flex alignItems-center pl-20">
                  <Box className="event-text-circle"></Box>
                  <Box className="h5-title">Komal Mane</Box>
                </Box>
              </Box>

              <Box className="d-flex mb-20 h3-custom-title xs-hide">
                <Box className="d-flex jc-bw alignItems-center">
                  <TodayOutlinedIcon className="h3-custom-title pr-5" />
                  {formatDate(detailData.startDate)}
                </Box>
                <Box className="d-flex jc-bw alignItems-center pl-5 pr-5">
                  <AccessAlarmsOutlinedIcon className="h3-custom-title pr-5" />

                  {formatTimeToIST(detailData.startTime)}
                </Box>
                <Box className="mx-15">To</Box>
                <Box className="d-flex jc-bw alignItems-center">
                  <TodayOutlinedIcon className="h3-custom-title pr-5" />
                  {formatDate(detailData.endDate)}
                </Box>
                <Box className="d-flex jc-bw alignItems-center pl-5 pr-5">
                  <AccessAlarmsOutlinedIcon className="h3-custom-title pr-5" />

                  {formatTimeToIST(detailData.endTime)}
                </Box>
              </Box>

              {canEnroll && !isEnrolled && (
                <Box className="xs-hide">
                  <Button
                    type="button"
                    className="custom-btn-success"
                    style={{
                      borderRadius: "30px",
                      color: "#fff",
                      padding: "10px 35px",
                      fontWeight: "500",
                      fontSize: "12px",
                      border: "solid 1px #1faf38",
                      background: "#1faf38",
                      marginTop: "10px",
                    }}
                  >
                    {t("JOIN_WEBINAR")}
                  </Button>
                </Box>
              )}
              {canJoin && isEnrolled && (
                <Box className="d-flex xs-hide">
                  <Button
                    type="button"
                    onClick={attendWebinar()}
                    style={{
                      borderRadius: "30px",
                      color: "#fff",
                      padding: "10px 35px",
                      fontWeight: "500",
                      fontSize: "12px",
                      border: "solid 1px #1976d2",
                      background: "#1976d2",
                      marginTop: "10px",
                    }}
                    className="custom-btn-primary mr-20"
                  >
                    {t("ATTEND_WEBINAR")}
                  </Button>
                  {canEnroll && (
                    <Button
                      type="button"
                      style={{
                        borderRadius: "30px",
                        color: "#fff",
                        padding: "10px 35px",
                        fontWeight: "500",
                        fontSize: "12px",
                        border: "solid 1px #e02f1d ",
                        background: "#e02f1d",
                        marginTop: "10px",
                      }}
                      className="custom-btn-danger"
                    >
                      {t("UN_REGISTER_WEBINAR")}
                    </Button>
                  )}
                </Box>
              )}
              {!canEnroll && !canJoin && isRecorded && (
                <Box className="xs-hide">
                  <Button
                    type="button"
                    className="custom-btn-success"
                    style={{
                      borderRadius: "30px",
                      color: "#fff",
                      padding: "10px 35px",
                      fontWeight: "500",
                      fontSize: "12px",
                      border: "solid 1px #1976d2",
                      background: "#1976d2",
                      marginTop: "10px",
                    }}
                    startIcon={<AdjustOutlinedIcon />}
                  >
                    {t("VIEW_WEBINAR_RECORDING")}
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={6} className="lg-pl-60 lg-hide">
              <Box className="h5-title mb-20" style={{ fontWeight: "400" }}>
                National Urban Learning Platform{" "}
              </Box>
              {creatorInfo &&
                (creatorInfo.firstName || creatorInfo.lastName) && (
                  <Box className="d-flex mb-20 alignItems-center">
                    <Box className="h5-title">Organised By:</Box>
                    <Box className="d-flex alignItems-center pl-20">
                      <Box className="event-text-circle"></Box>
                      <Box className="h5-title">
                        {creatorInfo.firstName
                          ? creatorInfo.firstName
                          : "" + " " + creatorInfo.lastName
                          ? creatorInfo.lastName
                          : ""}
                      </Box>
                    </Box>
                  </Box>
                )}

              <Box className="d-flex mb-20 h3-custom-title">
                <Box className="d-flex jc-bw alignItems-center">
                  <TodayOutlinedIcon className="h3-custom-title pr-5" />
                  {formatDate(detailData.startDate)}
                </Box>
                <Box className="d-flex jc-bw alignItems-center pl-5 pr-5">
                  <AccessAlarmsOutlinedIcon className="h3-custom-title pr-5" />

                  {formatTimeToIST(detailData.startTime)}
                </Box>
              </Box>
              <Box className="d-flex mb-20 h3-custom-title">
                <Box className="mr-15">To</Box>
                <Box className="d-flex jc-bw alignItems-center">
                  <TodayOutlinedIcon className="h3-custom-title pr-5" />
                  {formatDate(detailData.endDate)}
                </Box>
                <Box className="d-flex jc-bw alignItems-center pl-5 pr-5">
                  <AccessAlarmsOutlinedIcon className="h3-custom-title pr-5" />

                  {formatTimeToIST(detailData.endTime)}
                </Box>
              </Box>
              <Box>
                <Button
                  type="button"
                  className="custom-btn-success"
                  style={{
                    borderRadius: "30px",
                    color: "#fff",
                    padding: "10px 35px",
                    fontWeight: "500",
                    fontSize: "12px",
                    border: "solid 1px #1faf38",
                    background: "#1faf38",
                    marginTop: "10px",
                  }}
                  onClick={enrollEvent}
                >
                  {t("JOIN_WEBINAR")}
                </Button>
              </Box>
              <Box className="d-flex">
                <Button type="button" className="custom-btn-primary mr-20">
                  {t("ATTEND_WEBINAR")}
                </Button>
                <Button type="button" className="custom-btn-danger">
                  {t("UN_REGISTER_WEBINAR")}
                </Button>
              </Box>
              <Box>
                <Button
                  type="button"
                  className="custom-btn-success"
                  startIcon={<AdjustOutlinedIcon />}
                >
                  {t("VIEW_WEBINAR_RECORDING")}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} lg={4} className="text-right">
              <Box className="xs-hide">
                <FacebookShareButton url={shareUrl} className="pr-5">
                  <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
                <WhatsappShareButton url={shareUrl} className="pr-5">
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
                <LinkedinShareButton url={shareUrl} className="pr-5">
                  <LinkedinIcon size={32} round={true} />
                </LinkedinShareButton>
                <TwitterShareButton url={shareUrl} className="pr-5">
                  <img
                    src={require("../../assets/twitter.png")}
                    alt="Twitter"
                    style={{ width: 32, height: 32 }}
                  />
                </TwitterShareButton>
              </Box>
            </Grid>
            {/* <Box
              className="h2-title lg-event-margin"
              style={{ fontWeight: "600", width: "100%" }}
            >
              {t("SPEAKER_DETAILS")}
            </Box>
            <Grid container spacing={2} className="pl-20 mb-20">
              <Grid item xs={6} md={6} lg={3}>
                <Box className="d-flex">
                  <img
                    src={require("../../assets/speakerOne.png")}
                    className="eventImg"
                  />
                  <Box className="xs-pl-9 lg-pl-18">
                    <Box className="h5-title">Name Surname</Box>
                    <Box className="h5-title">Designation</Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={6} lg={3}>
                <Box className="d-flex">
                  <img
                    src={require("../../assets/speakertwo.png")}
                    className="eventImg"
                  />
                  <Box className="xs-pl-9 lg-pl-18">
                    <Box className="h5-title">Name Surname</Box>
                    <Box className="h5-title">Designation</Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={6} lg={3} className="mt-10">
                <Box className="d-flex">
                  <img
                    src={require("../../assets/speakerthree.png")}
                    className="eventImg"
                  />
                  <Box className="xs-pl-9 lg-pl-18">
                    <Box className="h5-title">Name Surname</Box>
                    <Box className="h5-title">Designation</Box>
                  </Box>
                </Box>
              </Grid>
            </Grid> */}
            <Box className="h2-title pl-20 mb-20" style={{ fontWeight: "600" }}>
              {t("WEBINAR_DETAILS")}
            </Box>
            <Box
              className="event-h2-title  pl-20 mb-20"
              style={{ fontWeight: "400" }}
            >
              {detailData.description}
            </Box>
          </Grid>
        </Container>
      )}
      <FloatingChatIcon />
      <Footer />
    </div>
  );
};

export default EventDetails;
