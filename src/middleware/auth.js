import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  //TODO Implement authentication
  return next();
};

export const adminAuth = async (req, res, next) => {
  //TODO Implement admin authentication

  if (!req.user?.isAdmin) {
    res.status(401)
    res.json({ error: "You must be an admin to do this. Ensure you have a valid admin token on the 'hakim-livs-token' header." })
    return
  }

  return next();
};