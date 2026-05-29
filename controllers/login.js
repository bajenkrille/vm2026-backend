import { prisma } from '../prismaClient.ts'
import { sendWelcomeMail} from '../services/mailService.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;
// const usrPsw = await bcrypt.hash("gurra", saltRounds)


// store hashedPassword in DB
const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )
 
export const loginUser = async (req ,res) => {
  console.log("Detta kom in: ",req.body.email,req.body.password);
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("hashed psw: ",hashedPassword);
  const deltagare = await prisma.deltagare.findFirst({
    where: { email: email },
  });
  const id = toJSON(deltagare.id)
  console.log(`Stored psw is ${deltagare.password}`);
  const isValid = await bcrypt.compare(password, deltagare.password);
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("token: ",token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded: ",decoded, "Userid: ",decoded.userId);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  } else {
    return res.status(200).json({
      token,
      user: {
        id: id,
        name: deltagare.nick_name,
        email: deltagare.email
      }
    })
  }
}

export const registerUser = async (req, res) => {
  console.log("Detta registreras: ",req.body.fornamn, req.body.email,req.body.password);
  console.log("Detta registreras: ",req.body);
  const { fornamn, efternamn, user, email, password, phone} = req.body
  const existingUser = await prisma.deltagare.findFirst({
    where: { nick_name: user },
  })
  console.log("existingUser:", existingUser);
  if (existingUser){
    return res.status(409).json({error: "Username already taken"})
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
  if (sparadAnvandare){
    const id = toJSON(sparadAnvandare.id)
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("sparadAnvandare",sparadAnvandare.email, sparadAnvandare.nick_name);
    sendWelcomeMail(sparadAnvandare.email, sparadAnvandare.nick_name)
    return res.status(201).json({
      message: "User created",
      token
    })
  }
}
