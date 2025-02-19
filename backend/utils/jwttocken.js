// sendToken.js
export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, // Always true for HTTPS
        sameSite: 'none', // Required for cross-site cookies
        domain: '.onrender.com', // Match your domain
        path: '/'
    };

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            message: "User authenticated successfully",
            user,
            token,
        });
};
