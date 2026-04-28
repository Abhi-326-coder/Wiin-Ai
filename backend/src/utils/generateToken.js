import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    // We generated the JWT_SECRET using "openssl rand -base64 32" going to git bash terminal
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //MilliSecond
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
} ;