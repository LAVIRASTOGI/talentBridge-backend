const express = require("express");
const User = require("../models/user");
const { encryptPassword } = require("../../utils/passwordEncrypt");
const {
  validateHandlerLogin,
  validateHandlerSignUp,
} = require("../../utils/validation");
const authRouter = express.Router();

// Controller functions
const signUp = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      emailId,
      yearsOfExperience,
      phoneNumber,
      skills,
    } = req.body;

    // Validate input data
    validateHandlerSignUp(req.body);

    // Create user with encrypted password
    const hashPassword = await encryptPassword(password);
    const user = new User({
      name,
      username,
      emailId,
      yearsOfExperience,
      phoneNumber,
      skills,
      password: hashPassword,
    });

    await user.save();

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { password, email_username } = req.body;

    const user = await User.findOne({
      $or: [{ emailId: email_username }, { username: email_username }],
    });
    validateHandlerLogin(req.body);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (user) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Generate token and set cookie
      const token = user.getJWTToken();
      const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.cookie("token", token, cookieOptions).status(200).json({
        success: true,
        user: userResponse,
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const signOut = (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({
      success: false,
      error: "Error during logout",
    });
  }
};

// Routes
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);

module.exports = authRouter;
