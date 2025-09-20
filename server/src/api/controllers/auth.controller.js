import userPool from '../../config/cognito.js';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import prisma from '../../../prisma/client.js';

export const signup = (req, res) => {
  const { name, email, password, role } = req.body;

  const attributeList = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'custom:role', Value: role }), // Custom attribute for role
  ];

  userPool.signUp(email, password, attributeList, null, async (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || JSON.stringify(err) });
    }

    try {
      await prisma.user.create({
        data: {
          id: result.userSub, 
          name,
          email,
          role, 
        },
      });
      res.status(201).json({ 
        message: 'User signed up successfully! Please check your email to verify.', 
        cognitoUsername: result.user.getUsername() 
      });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to save user to database.', details: dbError.message });
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
        message: 'Login successful!',
        tokens: {
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        },
      });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message || JSON.stringify(err) });
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
            return res.status(400).json({ error: err.message || JSON.stringify(err) });
        }
        res.status(200).json({ message: 'Email verified successfully!', result });
    });
};