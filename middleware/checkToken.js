const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {  // maybe implement this as a middleware
    const header = req.headers.authorization;
    
    if (!header) {
        res.json({ message: 'no token', access: false });
    } else {
        const token = header.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedFromToken) => {
            if (err) res.json({ message: 'failed to verify token', access: false});
            console.log('checked')
            console.log(decodedFromToken)
            res.json({ access: true, userData: {
                id: decodedFromToken.id,
                username: decodedFromToken.username,
                bio: decodedFromToken.bio,
                roomId: decodedFromToken.roomId
            } });
            next({verifiedUser: decodedFromToken});
        })
    }
    
    
}


module.exports = checkToken;