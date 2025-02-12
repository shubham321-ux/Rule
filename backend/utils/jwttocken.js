// sendToken.js

export const sendToken = (user, statusCode, res) => {
    // Create JWT token using the user's unique id
    const token = user.getJWTToken(); 

    // Set cookie options
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Expiry based on environment variable
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript (protects against XSS attacks)
        secure: process.env.NODE_ENV === 'production', // Sends cookie only over HTTPS in production
    };

    // Set token in the cookie and send the response
    res.status(statusCode)
        .cookie("token", token, options) // Set the cookie with the JWT token
        .json({
            success: true,
            message: "User authenticated successfully",
            user,
            token,
        });
};
