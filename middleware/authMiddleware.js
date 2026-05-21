import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("auth: ",authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "Missing Authorization header",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid Authorization header",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}