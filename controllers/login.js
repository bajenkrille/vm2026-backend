import { prisma } from "../prismaClient.ts";
import { sendWelcomeMail, sendPswResetMail } from "../services/mailService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const saltRounds = 10;
// const usrPsw = await bcrypt.hash("gurra", saltRounds)

// store hashedPassword in DB
const toJSON = (obj) =>
	JSON.parse(
		JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v))
	);

export const loginUser = async (req, res) => {
	console.log("Detta kom in: ", req.body.user, req.body.password);
	const { user, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	console.log("hashed psw: ", hashedPassword);
	const deltagare = await prisma.deltagare.findFirst({
		where: { nick_name: user },
	});
	if (!deltagare) {
		return res.status(401).json({ error: "Invalid username or password" });
	}
	const id = toJSON(deltagare.id);
	console.log(`Stored psw is ${deltagare.password}`);
	const isValid = await bcrypt.compare(password, deltagare.password);
	const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
	console.log("token: ", token);
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	console.log("Decoded: ", decoded, "Userid: ", decoded.userId);

	if (!isValid) {
		return res.status(401).json({ error: "Invalid username or password" });
	} else {
		return res.status(200).json({
			token,
			user: {
				id: id,
				name: deltagare.nick_name,
				email: deltagare.email,
			},
		});
	}
};

export const resetPsw = async (req, res) => {
	console.log("Detta kom in: ", req.body.token, req.body.password);
	const { token, password } = req.body;
	const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
	// const hashedPassword = await bcrypt.hash(password, saltRounds);
	// console.log("hashed psw: ",hashedPassword);
	// const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const tokenData = await prisma.reset_tokens.findFirst({
		where: { token_hash: tokenHash },
	});
	// const id = toJSON(deltagare.id)
	// console.log(`Stored psw is ${deltagare.password}`);
	console.log("hash_token: ", tokenData);
	// const isValid = await bcrypt.compare(token, tokenData.token_hash);
	// const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
	console.log("token: ", token);
	// console.log("Decoded: ",decoded, "Userid: ",decoded.userId);

	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const updatedDeltagare = await prisma.deltagare.update({
		where: { id: tokenData.user_id },
		data: { password: hashedPassword },
	});
	console.log("Updaterad deltagare:", updatedDeltagare);
	return res.status(200).json({
		token,
		user: {
			name: updatedDeltagare.nick_name,
			email: updatedDeltagare.email,
		},
	});
};

export const generateResetEmail = async (req, res) => {
	const expiryTime = "1h";
	const expiresIn = 60;
	const deltagare = await prisma.deltagare.findFirst({
		where: { nick_name: req.body.user },
	});
  console.log("req.body: ", req.body);
  console.log("deltagare: ",deltagare);
	const id = toJSON(deltagare.id);
	const rawToken = crypto.randomBytes(32).toString("hex");
	const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
	const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  console.log("id: ",id, "rawToken: ",rawToken,"tokenHash: ",tokenHash,"expiresAt: ",expiresAt);
	// const rawToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: expiryTime })
	// const hashedToken = await bcrypt.hash(rawToken, saltRounds)
	// const expiresAt = new Date(Date.now() + 1000 * 60 * expiresIn)
	const token_item = await prisma.reset_tokens.create({
		data: {
			user_id: id,
			token_hash: tokenHash,
			expires_at: expiresAt,
		},
	});
	if (token_item) {
		console.log("Email: ", deltagare.email, deltagare.nick_name);
		// const resetLink = `https://omyndigheten.se/reset?token=${rawToken}`
		const resetLink = `${process.env.FRONTEND_URL}/reset/${rawToken}`;
		sendPswResetMail(deltagare.email, resetLink, deltagare.nick_name);
	}
};

export const registerUser = async (req, res) => {
	console.log(
		"Detta registreras: ",
		req.body.fornamn,
		req.body.email,
		req.body.password
	);
	console.log("Detta registreras: ", req.body);
	const { fornamn, efternamn, user, email, password, phone } = req.body;
	const existingUser = await prisma.deltagare.findFirst({
		where: { nick_name: user },
	});
	console.log("existingUser:", existingUser);
	if (existingUser) {
		return res.status(409).json({ error: "Username already taken" });
	}
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const sparadAnvandare = await prisma.deltagare.create({
		data: {
			first_name: fornamn,
			last_name: efternamn,
			nick_name: user,
			email: email,
			password: hashedPassword,
			phone_number: phone,
		},
	});
	if (sparadAnvandare) {
		const id = toJSON(sparadAnvandare.id);
		const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		console.log(
			"sparadAnvandare",
			sparadAnvandare.email,
			sparadAnvandare.nick_name
		);
		const loginLink = `${process.env.FRONTEND_URL}/login`;
		sendWelcomeMail(sparadAnvandare.email, sparadAnvandare.nick_name, loginLink);
		return res.status(201).json({
			message: "User created",
			token,
		});
	}
};
