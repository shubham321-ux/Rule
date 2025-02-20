import User from "../models/userModel.js"
import { sendToken } from "../utils/jwttocken.js"
import { sendEmail } from "../utils/sendEmail.js"
import crypto from "crypto"
import cloudinary, { cloudinaryConfig }  from '../cloudinary/cloudinary.js';
import streamifier from "streamifier"
import upload from "../multer/multer.js"
import fs from "fs"

// Register user
// In your controller (userController.js)


export const registeruser = async (req, res) => {
    console.log("Registration request received:", req.body);
    console.log("File received:", req.file);

    try {
        const { name, email, password } = req.body;

        let avatarData = {
            public_id: 'default_avatar_id',
            url: 'https://default-avatar-url.com/avatar.png'
        };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                folder: 'avatars'
            });
            
            avatarData = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarData
        });

        const token = user.getJWTToken();

        res.status(201).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};










// Add multer upload middleware to the route
//login user

export const loginuser = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const isPasswordMatched = await user.comparePassword(password)
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }
        sendToken(user, 201, res)
    }
    catch (error) {
        console.log(error)
    }
}

//logout user
export const logoutuser = async (req, res, next) => {
    res.cookie("token", "", {
        expires: new Date(Date.now()), // Expire the cookie immediately
        httpOnly: true,  // Ensure cookie is HTTP only
        secure: process.env.NODE_ENV === "production",  // Secure cookie in production (uses HTTPS)
        sameSite: "strict",  // Prevent cross-site cookie sending
    });

    res.status(200).json({
        success: true,
        message: "logout successful"
    });
};

///forgot password
export const forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const frontendUrl =  process.env.FRONTEND_URL;
        const resetUrl = `${frontendUrl}/password-reset/${resetToken}`;

        // Email content
        const message = `
            Hello ${user.name},
            
            You requested a password reset. Please click the link below to reset your password:
            
            ${resetUrl}
            
            If you didn't request this, please ignore this email.
            
            Thanks,
          Bokifa Team
        `;

        // Send email
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        });
        console.log("Email sent successfully");

        return res.status(200).json({
            success: true,
            message: `Password reset email sent to ${user.email}`
        });

    } catch (error) {
        // Reset token fields in case of error
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }

        return res.status(500).json({
            success: false,
            message: "Email could not be sent",
            error: error.message
        });
    }
};

//reset password

export const resetpassword = async (req, res, next) => {
    const { token } = req.params
    const { password } = req.body
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "token is invalid or has been expired"
            })
        }
        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        res.status(200).json({
            success: true,
            message: "password reset successfully"
        })
    }
    catch (error) {
        console.log(error)
    }
}

//find user
export const getuser = async (req, res, next) => {
    try {
        // Use req.user from the isauthenticatedUser middleware
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


// Get user data from token stored in cookies
export const getUserFromToken = async (req, res, next) => {
    try {
        // Get the token from the cookie
        const token = req.cookies.token;

        // If no token is found in cookies
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, please log in"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the decoded token's user ID
        const user = await User.findById(decoded.id);

        // If no user is found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Return the user data in the response
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error getting user from token:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message || error
        });
    }
};

//update user password
export const updatepassword = async (req, res, next) => {
    const { oldpassword, newpassword, confirmpassword } = req.body
    try {
        const user = await User.findById(req.body.id).select("+password")
        const isPasswordMatched = await user.comparePassword(oldpassword)
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }
        if (newpassword !== confirmpassword) {
            return res.status(401).json({
                success: false,
                message: "password does not match"
            })
        }
        user.password = newpassword
        await user.save()
        res.status(200).json({
            success: true,
            message: "password updated successfully"
        }
        )
    }
    catch (error) {
        console.log(error)
    }
}

//update user
export const userupdate = async (req, res) => {
    try {
        const { id, name, email } = req.body;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let avatar = user.avatar;
        if (req.file) {
            // Delete old avatar from Cloudinary if exists
            if (user.avatar && user.avatar.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }

            // Upload new avatar
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'avatars',
                width: 150,
                crop: "scale"
            });
            
            fs.unlinkSync(req.file.path);
            
            avatar = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                avatar
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "An error occurred while updating the user",
            error: error.message
        });
    }
};


//get all users(admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
}


//get single user(admin)
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
           
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message
        });
    }
}


///update user role(admin)
export const updateUserRole = async (req, res) => {
    try {
        const { id, role } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    user.role = role;
    await user.save();
    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user
    });
}
catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "An error occurred while updating the user role",
        error: error.message
    });
}
}

//delete user(admin)
export const deleteuser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      await User.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the user",
        error: error.message
      });
    }
  }
  