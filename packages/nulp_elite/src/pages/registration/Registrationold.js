import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { Box, ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import ReCAPTCHA from "react-google-recaptcha";
import styled from "styled-components";
import { SITE_KEY } from "./Keys";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const DELAY = 1500;

function Registrationold() {
  const [load, setLoad] = useState(false);
  const [goToOtp, setGoToOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaResponse, setCaptchaResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const reCaptcha = React.createRef();
  const [emailExist, setEmailExist] = useState(false);
  const [otp, setOtp] = useState(""); // State to store OTP value
  const axios = require("axios");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      birthYear: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3).max(25).required("Please enter your name"),
      email: Yup.string()
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          "Invalid email format"
        )
        .email("Invalid email format")
        .required("Please enter your email"),
      birthYear: Yup.string().required("Please select your year of birth"),
      password: Yup.string()
        .min(8, "Your password must contain a minimum of 8 characters")
        .required("Password is required")
        .matches(/[0-9]/, "It must include numbers")
        .matches(/[A-Z]/, "It must include capital letter")
        .matches(/[a-z]/, "It must include small letter")
        .matches(/[!@#$%^&*(,.{}/?<>)]/, "It must include special character"),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("password")],
          "Confirm Password must be match with new password"
        )
        .required("Confirm Password is required"),
    }),
  });

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, DELAY);
  }, []);

  const handleSubmit = () => {
    formik.handleSubmit();
    if (formik && formik.isValid && formik.dirty && captchaResponse) {
      const isEmailExist = async () => {
        setIsLoading(true);
        setError(null);

        const url = `http://localhost:3000/learner/user/v1/exists/email/${formik.values.email}?captchaResponse=${captchaResponse}`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to verify OTP");
          }

          const data = await response.json();
          console.log("response:", data.result);
          if (data.result.exists) {
            setEmailExist(true);
          } else {
            generateOtp(formik.values.email);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      isEmailExist();

      const generateOtp = async (email) => {
        setIsLoading(true);
        setError(null);

        const url = `http://localhost:3000/learner/anonymous/otp/v1/generate?captchaResponse=${captchaResponse}`;
        const requestBody = {
          request: {
            key: email,
            type: "email",
            templateId: "wardLoginOTP",
          },
        };

        try {
          const response = await axios.post(url, requestBody, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.status !== 200) {
            throw new Error("Failed to generate OTP");
          }

          const data = response.data;
          console.log("OTP response:", data.result);
          localStorage.setItem(
            "registeringUser",
            JSON.stringify(formik.values)
          );
          getTermsAndCondition();
          setGoToOtp(true);
        } catch (error) {
          setError(error.message);
          setIsLoading(false);
        }
      };
      // generateOtp(formik.values.email);
    }
  };
  if (goToOtp) {
    return <Navigate to="/otp" />;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const onChange = (value) => {
    setCaptchaResponse(value);
    console.log("value", value);
  };

  const getTermsAndCondition = async () => {
    setIsLoading(true);
    setError(null);

    const url = `http://localhost:3000/learner/data/v1/system/settings/get/tncConfig`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to verify");
      }

      const data = await response.json();
      console.log("response:", data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ChakraProvider>
      <Wrapper>
        <Box className="container">
          <Box className="modal">
            <Box className="modal-container">
              <Box className="modal-left">
                <h1 className="modal-title">Register</h1>
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <label htmlFor="name" className="input-label">
                    Name <span className="required">*</span>
                  </label>
                  <Box
                    className={`input-block ${
                      formik.touched.name && formik.errors.name ? "invalid" : ""
                    }`}
                  >
                    <input
                      type="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder="Name Surname"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Box>
                  {formik.touched.name && formik.errors.name && (
                    <p className="form-error">{formik.errors.name}</p>
                  )}
                  <label htmlFor="email" className="input-label">
                    Email
                    <span className="required">*</span>
                  </label>
                  <Box
                    className={`input-block ${
                      formik.touched.email && formik.errors.email
                        ? "invalid"
                        : ""
                    }`}
                  >
                    <input
                      type="email"
                      autoComplete="off"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Box>
                  {formik.touched.email && formik.errors.email && (
                    <p className="form-error">{formik.errors.email}</p>
                  )}
                  {emailExist && (
                    <p className="form-error">Email already exist</p>
                  )}
                  <label htmlFor="birthYear" className="input-label">
                    Year of Birth
                    <span className="required">*</span>
                  </label>
                  <Box
                    className={`input-block ${
                      (formik.touched.birthYear && formik.errors.birthYear) ||
                      emailExist
                        ? "invalid"
                        : ""
                    }`}
                  >
                    <select
                      name="birthYear"
                      id="birthYear"
                      value={formik.values.birthYear}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Birth Year</option>
                      {[...Array(100)].map((_, index) => {
                        const year = new Date().getFullYear() - index;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </Box>
                  {formik.touched.birthYear && formik.errors.birthYear && (
                    <p className="form-error">{formik.errors.birthYear}</p>
                  )}
                  <label htmlFor="password" className="input-label">
                    New Password <span className="required">*</span>
                  </label>
                  <Box
                    className={`input-block ${
                      formik.touched.password && formik.errors.password
                        ? "invalid"
                        : ""
                    }`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="off"
                      name="password"
                      id="password"
                      placeholder="New Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span
                      className="toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </span>
                  </Box>
                  {formik.touched.password && formik.errors.password && (
                    <p className="form-error">{formik.errors.password}</p>
                  )}
                  <label htmlFor="confirmPassword" className="input-label">
                    Confirm New Password
                    <span className="required">*</span>
                  </label>
                  <Box
                    className={`input-block ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "invalid"
                        : ""
                    }`}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="off"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Confirm New Password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span
                      className="toggle-password"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </span>
                  </Box>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="form-error">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                  <Box className="modal-buttons">
                    <button
                      className={`input-button ${
                        !formik.dirty ||
                        (formik.dirty && !formik.isValid && !captchaResponse)
                          ? "disabled-opacity"
                          : ""
                      }`}
                      type="button"
                      disabled={
                        !formik.dirty ||
                        (formik.dirty && !formik.isValid && !captchaResponse)
                      }
                      onClick={handleSubmit}
                    >
                      Continue
                    </button>
                  </Box>
                  <Box className="modal-right">
                    {load && (
                      <ReCAPTCHA
                        ref={reCaptcha}
                        style={{ display: "inline-block" }}
                        theme="dark"
                        sitekey={SITE_KEY}
                        onChange={onChange}
                      />
                    )}
                  </Box>
                </form>
                <p className="sign-up">
                  Already have an account? <a href="/contents">Login</a>
                </p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Wrapper>
    </ChakraProvider>
  );
}

const Wrapper = styled.section`
  /* Your styles */
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #efedee;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .modal-right {
    flex: 1;
    display: flex;
    justify-content: flex-end; /* Align to the right */
    align-items: center;
    padding: 20px;
  }

  .modal-left {
    padding: 60px 30px 20px;
    background: #fff;
    flex: 1.5;
    opacity: 1;
  }

  .error {
    border-color: #b22b27 !important;
  }

  .invalid {
    border: 1px solid #ff0000 !important;
  }

  .modal {
    width: 100%;
    background: rgba(51, 51, 51, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.4s;
  }

  .modal-container {
    display: flex;
    max-width: 60vw;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    background: #fff;
  }

  .modal-title {
    margin: 0;
    font-weight: 400;
    color: #1e1e1d;
    text-align: center;
  }

  .required {
    color: red;
    margin-left: 2px;
  }

  .input-block {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #8692ed;
    border-radius: 12px;
    margin-bottom: 20px;
    transition: 0.3s;
    width: 100%;
    position: relative;
  }

  .input-block input,
  .input-block select {
    outline: 0;
    border: 0;
    padding: 4px 0 0;
    font-size: 14px;
  }

  .toggle-password {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .toggle-password svg {
    width: 20px;
    height: 20px;
    color: #ccc;
  }

  .input-button {
    padding: 1.2rem 6.2rem;
    outline: none;
    text-transform: uppercase;
    border: 0;
    color: #fff;
    border-radius: 12px;
    background: #8692ed;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }

  .input-button:hover {
    background: #55311c;
  }

  .sign-up {
    margin: 30px 0 0;
    font-size: 14px;
    text-align: center;
  }

  .sign-up a {
    color: #8692ed;
  }

  @media (max-width: 768px) {
    .modal-container {
      max-width: 90vw;
    }
  }

  .disabled-opacity {
    opacity: 0.2 !important;
  }
`;

export default Registrationold;
