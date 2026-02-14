import crypto from "crypto";
import User from "../models/user.js";
import { hashPasword, comparePassword } from "../auth/bcrypt.js";
import { generateToken } from "../auth/jwt.js";
import cloudinary from "../config/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

import dotenv from "dotenv";

dotenv.config();

/* ===========================
   REGISTER USER (NO OTP)
   =========================== */
// export const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await hashPasword(password);

//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       isVerified: true, // 🔥 direct verified
//     });

//     res.status(201).json({
//       message: "Account created successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    let user = userExists;

    if (!user) {
      const hashedPassword = await hashPasword(password);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });
    }

    // 🔐 OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    // 📧 SEND OTP EMAIL
    await sendEmail({
      to: email,
      subject: "Your LamhaStore OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 2 minutes.</p>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ VERIFY USER
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    /* 📧 WELCOME EMAIL (NON-BLOCKING) */
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to LamhaStore 🎉",
        html: `
          <h2>Welcome ${user.name} 👋</h2>
          <p>Your LamhaStore account has been successfully verified.</p>
          <p>You can now login and start shopping.</p>
        `,
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
      // ❗ ignore error
    }

    res.status(200).json({
      message: "Account verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    // 🔐 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // ⏳ Overwrite OTP
    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    // 📧 Send OTP email
    await sendEmail({
      to: email,
      subject: "Your LamhaStore OTP (Resent)",
      html: `
        <h2>OTP Verification</h2>
        <p>Your new OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 2 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 📩 Email to Admin
    await sendEmail({
      to: process.env.EMAIL_USER, // your support email
      subject: "New Contact Message - BuyToro",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 📩 Confirmation email to user
    await sendEmail({
      to: email,
      subject: "We received your message - BuyToro",
      html: `
        <h2>Thank you for contacting BuyToro</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and our team will get back to you soon.</p>
        <br/>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   LOGIN USER
   =========================== */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   GET USER PROFILE
   =========================== */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/* ===========================
   UPDATE PROFILE
   =========================== */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.file) {
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      user.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   CHANGE PASSWORD
   =========================== */
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await hashPasword(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   DELETE ACCOUNT
   =========================== */
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    await user.deleteOne();

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   ADMIN – GET ALL USERS
   =========================== */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/* ===========================
   WISHLIST
   =========================== */
export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyExists = user.wishlist.includes(productId);

  if (alreadyExists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();

  res.json({
    wishlist: user.wishlist,
    message: alreadyExists ? "Removed from wishlist" : "Added to wishlist",
  });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.wishlist);
};

// import User from "../models/user.js";
// import { hashPasword, comparePassword } from "../auth/bcrypt.js";
// import { generateToken } from "../auth/jwt.js";
// import cloudinary from "../config/cloudinary.js";
// import crypto from "crypto";
// import emailjs from "@emailjs/nodejs";

// /* ===========================
//    REGISTER USER (WITH OTP)
//    =========================== */
// // export const registerUser = async (req, res, next) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     const userExists = await User.findOne({ email });
// //     if (userExists && userExists.isVerified) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }

// //     const hashedPassword = await hashPasword(password);

// //     // 🔐 generate OTP (plain)
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //     // 🔒 hash OTP for DB
// //     const hashedOtp = crypto
// //       .createHash("sha256")
// //       .update(otp)
// //       .digest("hex");

// //     let user = userExists;

// //     if (!user) {
// //       user = await User.create({
// //         name,
// //         email,
// //         password: hashedPassword,
// //         otp: hashedOtp,
// //         otpExpires: Date.now() + 10 * 60 * 1000, // 10 min
// //         isVerified: false,
// //       });
// //     } else {
// //       user.otp = hashedOtp;
// //       user.otpExpires = Date.now() + 10 * 60 * 1000;
// //       await user.save();
// //     }

// //     // 📧 SEND OTP EMAIL (🔥 MAIN FIX)
// //     await emailjs.send(
// //       process.env.EMAILJS_SERVICE_ID,
// //       process.env.EMAILJS_TEMPLATE_ID,
// //       {
// //         email,          // template variable
// //         passcode: otp,  // ⚠️ यही missing था
// //         time: "10 minutes",
// //       },
// //       {
// //         publicKey: process.env.EMAILJS_PUBLIC_KEY,
// //       }
// //     );

// //     res.status(200).json({
// //       message: "OTP sent to email",
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// export const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     let user = await User.findOne({ email });

//     // ❌ Already verified user
//     if (user && user.isVerified) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // 🔐 Hash password ONLY once
//     if (!user) {
//       const hashedPassword = await hashPasword(password);
//       user = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         isVerified: false,
//       });
//     }

//     // 🔐 Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // 🔒 Hash OTP for DB
//     const hashedOtp = crypto
//       .createHash("sha256")
//       .update(otp)
//       .digest("hex");

//     // ⏳ Save OTP temporarily
//     user.otp = hashedOtp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
//     await user.save();

//     /* =========================
//        EMAIL OPTIONAL (SAFE)
//        ========================= */
//     try {
//       await emailjs.send(
//         process.env.EMAILJS_SERVICE_ID,
//         process.env.EMAILJS_TEMPLATE_ID,
//         {
//           email,
//           passcode: otp,
//           time: "10 minutes",
//         },
//         {
//           publicKey: process.env.EMAILJS_PUBLIC_KEY,
//         }
//       );
//     } catch (emailError) {
//       console.error("Email failed, rolling back OTP");

//       console.log(emailError)

//       // 🧹 CLEANUP (IMPORTANT)
//       user.otp = undefined;
//       user.otpExpires = undefined;
//       await user.save();

//       return res.status(500).json({
//         message: "OTP email failed. Please try again.",
//       });
//     }

//     return res.status(200).json({
//       message: "OTP generated and sent",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const verifyOtp = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "User already verified" });
//     }

//     if (!user.otp || !user.otpExpires) {
//       return res.status(400).json({ message: "OTP not found" });
//     }

//     if (user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     const hashedOtp = crypto
//       .createHash("sha256")
//       .update(otp)
//       .digest("hex");

//     if (hashedOtp !== user.otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // ✅ VERIFY USER
//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpires = undefined;

//     await user.save();

//     res.json({
//       message: "Account verified successfully. Please login.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    LOGIN USER
//    =========================== */
// export const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: "Invalid email or password" });
//     }

//     if (user.isBlocked) {
//       return res
//         .status(403)
//         .json({ message: "Account is blocked" });
//     }
//     if (!user.isVerified) {
//   return res
//     .status(403)
//     .json({ message: "Please verify your email first" });
// }

//     const isMatch = await comparePassword(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({
//       message: "Login successful",
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       profileImage: user.profileImage,
//       isVerified: user.isVerified,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    GET USER PROFILE
//    =========================== */
// export const getUserProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    UPDATE PROFILE
//    =========================== */
// export const updateUserProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (req.body.name) {
//       user.name = req.body.name;
//     }

//     if (req.file) {
//       if (user.profileImage?.public_id) {
//         await cloudinary.uploader.destroy(
//           user.profileImage.public_id
//         );
//       }

//       user.profileImage = {
//         url: req.file.path,
//         public_id: req.file.filename,
//       };
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//       profileImage: updatedUser.profileImage,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    CHANGE PASSWORD
//    =========================== */
// export const changePassword = async (req, res, next) => {
//   try {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await comparePassword(
//       oldPassword,
//       user.password
//     );
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ message: "Old password is incorrect" });
//     }

//     user.password = await hashPasword(newPassword);
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    DELETE ACCOUNT
//    =========================== */
// export const deleteAccount = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.profileImage?.public_id) {
//       await cloudinary.uploader.destroy(
//         user.profileImage.public_id
//       );
//     }

//     await user.deleteOne();

//     res.json({ message: "Account deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    ADMIN – GET ALL USERS
//    =========================== */
// export const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find({}).select("-password");
//     res.json(users);
//   } catch (error) {
//     next(error);
//   }
// };

// /* ===========================
//    WISHLIST
//    =========================== */
// export const toggleWishlist = async (req, res) => {
//   const user = await User.findById(req.user._id);
//   const { productId } = req.params;

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const alreadyExists = user.wishlist.includes(productId);

//   if (alreadyExists) {
//     user.wishlist = user.wishlist.filter(
//       (id) => id.toString() !== productId
//     );
//   } else {
//     user.wishlist.push(productId);
//   }

//   await user.save();

//   res.json({
//     wishlist: user.wishlist,
//     message: alreadyExists
//       ? "Removed from wishlist"
//       : "Added to wishlist",
//   });
// };

// export const getWishlist = async (req, res) => {
//   const user = await User.findById(req.user._id).populate("wishlist");

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.json(user.wishlist);
// };
