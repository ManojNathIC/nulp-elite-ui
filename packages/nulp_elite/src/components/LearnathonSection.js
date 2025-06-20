import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import * as util from "../services/utilService";
import ToasterCommon from "../pages/ToasterCommon";
const urlConfig = require("../configs/urlConfig.json");
const routeConfig = require("../configs/routeConfig.json");

const LearnathonSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State variables
  const [lernUser, setLernUser] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState([]);
  const [isReviewer, setIsReviewer] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterOpen, setToasterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user ID
  const _userId = util.userId();

  // Date calculations
  const today = dayjs();
  const isLearnathonStarted = today.isAfter(
    urlConfig.LEARNATHON_DATES.CONTENT_SUBMISSION_START_DATE
  );

  const isParticipateNow = today.isBetween(
    dayjs(urlConfig.LEARNATHON_DATES.CONTENT_SUBMISSION_START_DATE),
    dayjs(urlConfig.LEARNATHON_DATES.CONTENT_SUBMISSION_END_DATE),
    "minute"
  );

  const isAfterSubmission = today.isAfter(
    dayjs(urlConfig.LEARNATHON_DATES.CONTENT_SUBMISSION_END_DATE),
    "minute"
  );

  const isReviewNow = today.isBetween(
    dayjs(urlConfig.LEARNATHON_DATES.CONTENT_REVIEW_START_DATE),
    dayjs(urlConfig.LEARNATHON_DATES.CONTENT_REVIEW_END_DATE),
    "minute"
  );

  const isVoteNow = today.isBetween(
    dayjs(urlConfig.LEARNATHON_DATES.VOTING_START_DATE),
    dayjs(urlConfig.LEARNATHON_DATES.VOTING_END_DATE),
    "minute"
  );

  // Fetch user data
  const fetchData = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.GET_PROFILE}${_userId}`;
      const response = await fetch(url);
      const data = await response.json();
      const rolesData = data.result.response.channel;
      const roles = data.result.response.roles;

      let organizationId;
      if (roles[0]?.scope[0]?.organisationId) {
        organizationId = roles[0].scope[0].organisationId;
      } else {
        organizationId =
          data?.result?.response?.organisations[0]?.organisationId;
      }

      const extractedRoles = roles.map((roleObj) => roleObj.role);
      setRoleList(extractedRoles);
      setIsReviewer(extractedRoles.includes("SYSTEM_ADMINISTRATION"));
      setOrgId(organizationId);
      setLernUser(rolesData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Check user access
  const checkAccess = async () => {
    try {
      const url = `${urlConfig.URLS.CHECK_USER_ACCESS}`;
      const response = await fetch(url);
      const data = await response.json();

      const userID = data.result.data;
      const user = userID.find((user) => user.user_id === _userId);

      if (!user) {
        fetchUserAccess();
      } else if (
        user.creator_access === true ||
        user.creator_access === false
      ) {
        navigate("/webapp/mylernsubmissions");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Navigate after logout
  const navigateConsecutively = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        showErrorMessage(
          "Thank you for participation. Please relogin to get submission access"
        );
        localStorage.clear();
        navigate("/webapp/mylernsubmissions");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Fetch user access
  const fetchUserAccess = async () => {
    try {
      const url = `${urlConfig.URLS.PROVIDE_ACCESS}`;
      const isCreator = roleList.includes("CONTENT_CREATOR");
      const role = isCreator ? roleList : ["CONTENT_CREATOR", ...roleList];

      const requestPayload = {
        request: {
          organisationId: orgId,
          roles: role,
          userId: _userId,
        },
      };

      if (isCreator) {
        requestPayload.isCreator = false;
      } else {
        requestPayload.isCreator = true;
      }

      const response = await axios.post(url, requestPayload);
      const data = await response.data;
      const result = data.result.data.responseCode;

      if (result === "OK") {
        navigateConsecutively();
        setIsModalOpen(false);
      } else {
        setToasterMessage("Something went wrong! Please try again later");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Handle user check
  const handleCheckUser = async () => {
    if (lernUser === "nulp-learn") {
      navigate("/webapp/mylernsubmissions");
    } else {
      await checkAccess();
    }
  };

  // Show error message
  const showErrorMessage = (msg) => {
    setToasterMessage(msg);
    setTimeout(() => {
      setToasterMessage("");
    }, 2000);
    setToasterOpen(true);
  };

  // Fetch user data on component mount
  useEffect(() => {
    if (_userId) {
      fetchData();
    }
  }, [_userId]);

  // Don't render if learnathon hasn't started
  if (!isLearnathonStarted) {
    return null;
  }

  return (
    <>
      {toasterMessage && <ToasterCommon response={toasterMessage} />}
      <Box className="lern-box">
        <Box>
          <Grid container>
            <Grid item xs={12}>
              <Box className="h1-title">{t("LERN_title")}</Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box className="mt-20">{t("LERN_MESSAGE_LINE_TWO")}</Box>
            </Grid>
            {!isLearnathonStarted && (
              <Grid item xs={12} md={3}>
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <Button className="viewAll" onClick={handleCheckUser}>
                      {lernUser === "nulp-learn"
                        ? t("PARTICIPATE_NOW")
                        : t("PARTICIPATE_NOW")}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className="viewAll"
                      onClick={() => {
                        window.open(
                          routeConfig.ROUTES.LEARNATHON.LERNREVIEWLIST,
                          "_blank"
                        );
                      }}
                    >
                      Review Now
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className="viewAll"
                      onClick={() => {
                        window.open(
                          routeConfig.ROUTES.LEARNATHON.LERNVOTINGLIST,
                          "_blank"
                        );
                      }}
                    >
                      Vote Now
                    </Button>
                  </Grid>
                  {isAfterSubmission && (
                    <Grid item xs={12}>
                      <Button className="viewAll" onClick={handleCheckUser}>
                        {t("SEE_YOUR_SUBMISSION")}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
            {isLearnathonStarted && (
              <Grid item xs={12} md={3}>
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  {isParticipateNow && (
                    <Grid item xs={12}>
                      <Button className="viewAll" onClick={handleCheckUser}>
                        {t("PARTICIPATE_NOW")}
                      </Button>
                    </Grid>
                  )}
                  {isAfterSubmission && (
                    <Grid item xs={12}>
                      <Button className="viewAll" onClick={handleCheckUser}>
                        {t("SEE_YOUR_SUBMISSION")}
                      </Button>
                    </Grid>
                  )}
                  {isReviewNow && isReviewer && (
                    <Grid item xs={12}>
                      <Button
                        className="viewAll"
                        onClick={() => {
                          window.open(
                            routeConfig.ROUTES.LEARNATHON.LERNREVIEWLIST,
                            "_blank"
                          );
                        }}
                      >
                        {t("REVIEW_NOW")}
                      </Button>
                    </Grid>
                  )}
                  {isVoteNow && (
                    <Grid item xs={12}>
                      <Button
                        className="viewAll"
                        onClick={() => {
                          window.open(
                            routeConfig.ROUTES.LEARNATHON.LERNVOTINGLIST,
                            "_blank"
                          );
                        }}
                      >
                        {t("VOTE_NOW")}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              {toasterMessage && (
                <Box>
                  <ToasterCommon response={toasterMessage} />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LearnathonSection;
