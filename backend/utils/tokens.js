import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
};