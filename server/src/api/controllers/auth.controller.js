import { getUserPool } from "../../config/cognito.js";3
const userPool = getUserPool();
import {
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import prisma from "../../prisma/client.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const attributeList = [
    new CognitoUserAttribute({ Name: "name", Value: name }),
    new CognitoUserAttribute({ Name: "email", Value: email }),
  ];
   
  userPool.signUp(email, password, attributeList, null, async (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || JSON.stringify(err) });
    }

    try {
      const validRoles = ["ENTREPRENEUR", "INVESTOR"];
      const finalRole = validRoles.includes(role) ? role : "ENTREPRENEUR";
      await prisma.user.create({
        data: {
          id: result.userSub,
          name,
          email,
          role: finalRole,
          profileComplete: false // must match enum exactly
        },
      });
      res.status(201).json({
        message: "User signed up successfully!",
        cognitoUsername: result.user.getUsername(),
      });
    } catch (dbError) {
      res.status(500).json({ error: "Failed to save user to database.", details: dbError.message });
    }
  });
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

export const changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: oldPassword,
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: () => {
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: "Password changed successfully." });
      });
    },
    onFailure: (err) => {
      res.status(400).json({ error: "Incorrect old password." });
    },
  });
};

export const verifySmsMfa = (req, res) => {
    const { email, mfaCode } = req.body;

    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
    });

    // The cognitoUser object is stateful. The amazon-cognito-identity-js library
    // holds the user's session state after the initial login attempt.
    // This is why we don't need to re-authenticate here.
    cognitoUser.sendMFACode(mfaCode, {
        onSuccess: (session) => {
            res.status(200).json({
                message: "MFA verified and login successful!",
                tokens: {
                    idToken: session.getIdToken().getJwtToken(),
                    accessToken: session.getAccessToken().getJwtToken(),
                    refreshToken: session.getRefreshToken().getToken(),
                },
            });
        },
        onFailure: (err) => {
            res.status(400).json({ error: "Invalid MFA code. Please try again." });
        },
    }, 'SMS_MFA'); // Specify the MFA type
};