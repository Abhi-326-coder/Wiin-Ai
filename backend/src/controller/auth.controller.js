import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const Signup =async (req, res) => {
    try {
        const { fullName, email, password } = req.body || {};
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingUser = await User.findOne({email});

        if(existingUser){ 
            return res.status(400).json({message: "User already exists"});
        }

        const existingEmail = await User.findOne({ email });

		if (existingEmail) { 
			return res.status(400).json({ error: "Email is already taken" });
		}

        if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

        const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, 
            email, 
            password: hashedPassword
        });

        if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}

     }catch (error) {
        console.log(`Error in Signup: ${error}`);
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const Login = async (req, res) => {
    try {
        const {email , password} = req.body || {};

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(400).json({message:"User Not Found"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password || "");

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

        generateTokenAndSetCookie(existingUser._id, res);

		res.status(200).json({
			_id: existingUser._id,
			fullName: existingUser.fullName,
			email: existingUser.email
		});

    } catch (error) {
        console.log(`Error in Login: ${error}`);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const Logout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({ message: "Logged out successfully" });
}

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};