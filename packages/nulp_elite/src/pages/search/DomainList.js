// Profile.js

import React, { useState, useEffect } from "react";
// import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Layout, IconByName } from "@shiksha/common-lib";
import {
  NativeBaseProvider,
  Stack,
  VStack,
  Text,
  HStack,
  Button,
  Menu,
  Image,
} from "native-base";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import BoxCard from "components/Card";
import Box from "@mui/material/Box";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const theme = createTheme();

theme.typography.h3 = {
  fontSize: "0.938rem",
  "@media (min-width:600px)": {
    fontSize: "1.1rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.125rem",
  },
};

const DomainList = () => {
  // console.log(data.result.categories.terms.category);
  const [search, setSearch] = React.useState(true);
  const [searchState, setSearchState] = React.useState(false);

  return (
    <Layout
      isDisabledAppBar={true}
      _header={{
        rightIcon: (
          <HStack paddingBottom={"25px"}>
            <IconByName name="CloseCircleFillIcon" />
          </HStack>
        ),
        customeComponent: (
          <Box flex={1} minH={"40px"}>
            <HStack>
              <VStack position={"relative"} padding="10px" top={"10px"}>
                <Menu
                  w="160"
                  trigger={(triggerProps) => {
                    return (
                      <Button
                        alignSelf="center"
                        variant="solid"
                        {...triggerProps}
                      >
                        <IconByName size="20px" name="MenuFillIcon" />
                      </Button>
                    );
                  }}
                >
                  <Menu.Item>Help</Menu.Item>
                  <Menu.Item>Logout</Menu.Item>
                </Menu>
              </VStack>

              <VStack>
                {/* <Image
                  source={require("./assets/logo.png")}
                  alt=""
                  size="sm"
                /> */}
              </VStack>
            </HStack>

            {/* <Right> */}
            <Box position={"absolute"} right={"20px"} top={"10px"}>
              <Menu
                w="160"
                trigger={(triggerProps) => {
                  return (
                    <Button
                      alignSelf="center"
                      variant="solid"
                      {...triggerProps}
                    >
                      Language
                    </Button>
                  );
                  // }}>
                }}
              >
                <Menu.Item>English</Menu.Item>
                <Menu.Item> Hindi</Menu.Item>
              </Menu>
            </Box>
            {/* </Right> */}

            {/* <Avatar
           size="48px"
           borderRadius=""
              source={require("../assets/nulp_logo.jpeg")}
          /> */}

            {/* <VStack>
          <Avatar
            size="37px"
            borderRadius="md"
            source={{
              uri: "https://via.placeholder.com/50x50.png",
            }}
          />
          </VStack> */}
          </Box>
        ),
        // title: "User Name",
        // // isEnableSearchBtn: true,
        // subHeading: "Hello",
        // iconComponent: (

        // ),
      }}
      _subHeader={{ bg: "rgb(248, 117, 88)" }}
      _footer={{
        menues: [
          {
            title: "Search",
            icon: "SearchLineIcon",
            route: "/contents",
          },
          {
            title: "Contents",
            icon: "BookOpenLineIcon",
            route: "/all",
          },
          {
            title: "Connections",
            icon: "TeamLineIcon",
            route: "/home",
          },
          {
            title: "Profie",
            icon: "AccountCircleLineIcon",
            route: "/profile",
          },
        ],
      }}
    >
      <Container>
        <BoxCard></BoxCard>
        <ThemeProvider theme={theme}>
          <Typography variant="h3" sx={{ marginTop: "30px" }}>
            Filter by popular domain
          </Typography>
        </ThemeProvider>
        <Grid container spacing={2} style={{ margin: "20px 0" }}>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Box
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  height: "60px",
                  width: "90px",
                  border: "solid 1px #E1E1E1",
                }}
              >
                <img
                  src={require("../../assets/logo.png")}
                  style={{ width: "100%" }}
                />
              </Box>
              <h5
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  paddingLeft: "10px",
                  margin: "0",
                }}
              >
                Solid Waste Managment
              </h5>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Box
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  height: "60px",
                  width: "90px",
                  border: "solid 1px #E1E1E1",
                }}
              >
                <img
                  src={require("../../assets/logo.png")}
                  style={{ width: "100%" }}
                />
              </Box>
              <h5
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  paddingLeft: "10px",
                  margin: "0",
                }}
              >
                Solid Waste Managment
              </h5>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Box
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  height: "60px",
                  width: "90px",
                  border: "solid 1px #E1E1E1",
                }}
              >
                <img
                  src={require("../../assets/logo.png")}
                  style={{ width: "100%" }}
                />
              </Box>
              <h5
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  paddingLeft: "10px",
                  margin: "0",
                }}
              >
                Solid Waste Managment
              </h5>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Box
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  height: "60px",
                  width: "90px",
                  border: "solid 1px #E1E1E1",
                }}
              >
                <img
                  src={require("../../assets/logo.png")}
                  style={{ width: "100%" }}
                />
              </Box>
              <h5
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  paddingLeft: "10px",
                  margin: "0",
                }}
              >
                Solid Waste Managment
              </h5>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default DomainList;
