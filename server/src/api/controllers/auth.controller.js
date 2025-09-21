import userPool from "../../config/cognito.js";
import {
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import prisma from "../../../prisma/client.js";

export const signup = (req, res) => {
  const {
    name,
    email,
    password,
    role,
    address,
    profilePic,
    DOB,
    gender,
    Phoneno,
  } = req.body;

  const attributeList = [
    new CognitoUserAttribute({ Name: "name", Value: name }),
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "phone_number", Value: Phoneno }),
    new CognitoUserAttribute({ Name: "gender", Value: gender }),
    new CognitoUserAttribute({ Name: "birthdate", Value: DOB }), // Format: YYYY-MM-DD
    new CognitoUserAttribute({ Name: "address", Value: address }),
    new CognitoUserAttribute({ Name: "custom:role", Value: role }),
    new CognitoUserAttribute({ Name: "custom:profilePic", Value: profilePic }),
  ];

  userPool.signUp(
    email,
    password,
    attributeList,
    null,
    async (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ error: err.message || JSON.stringify(err) });
      }

      try {
        await prisma.user.create({
          data: {
            id: result.userSub,
            name,
            email,
            role,
            address,
            profilePic,
            DOB: DOB ? new Date(DOB) : null,
            gender,
            Phoneno,
          },
        });
        res.status(201).json({
          message:
            "User signed up successfully! Please check your email to verify.",
          cognitoUsername: result.user.getUsername(),
        });
      } catch (dbError) {
        res
          .status(500)
          .json({
            error: "Failed to save user to database.",
            details: dbError.message,
          });
      }
    }
  );
};


export const login = (req, res) => {
  const { email, password } = req.body;

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (session) => {
      res.status(200).json({
        message: "Login successful!",
        tokens: {
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        },
      });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message });
    },
  });
};

export const verifyEmail = (req, res) => {
  const { email, verificationCode } = req.body;

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json({ message: "Email verified successfully!", result });
  });
};



export const forgotPassword = (req, res) => {
  const { email } = req.body;
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

  cognitoUser.forgotPassword({
    onSuccess: () => {
      res
        .status(200)
        .json({
          message: "A verification code has been sent to your email.",
        });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message });
    },
  });
};

export const confirmForgotPassword = (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess: () => {
      res.status(200).json({ message: "Password has been reset successfully." });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message });
    },
  });
};

export const refreshToken = (req, res) => {
  const { refreshToken, email } = req.body;
  const RefreshToken = new CognitoRefreshToken({ RefreshToken: refreshToken });
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

  cognitoUser.refreshSession(RefreshToken, (err, session) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json({
      message: "Token refreshed successfully!",
      tokens: {
        idToken: session.getIdToken().getJwtToken(),
        accessToken: session.getAccessToken().getJwtToken(),
      },
    });
  });
};

export const logout = (req, res) => {
  const { email } = req.body;
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  cognitoUser.signOut();
  res.status(200).json({ message: "Logout successful!" });
};