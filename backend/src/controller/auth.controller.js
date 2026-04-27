import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const Signup =async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        
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

        const newUser = await new User({
            fullName, 
            email, 
            password: hashedPassword
        });

        return res.status(200).json(newUser);

     }catch (error) {
        console.log(`Error in Signup: ${error}`);
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const Login = (req, res) => {
    try {
        
    } catch (error) {
        console.log(`Error in Login: ${error}`);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

export const Logout = (req, res) => {
    try {
        
    } catch (error) {
        console.log(`Error in Logout: ${error}`);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}