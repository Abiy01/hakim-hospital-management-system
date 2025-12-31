export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  // Determine the cookie name based on the user's role
  // Admin uses adminToken, Doctor and Patient use patientToken
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

  // Cookie options for cross-origin support
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in production
  };

  res
    .status(statusCode)
    .cookie(cookieName, token, cookieOptions)
    .json({
      success: true,
      message,
      user,
      token,
    });
};
