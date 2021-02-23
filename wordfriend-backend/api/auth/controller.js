const { OAuth2Client } = require("google-auth-library");
const { client_id, client_secret } = require("../../config/client");
const googleOAuthClient = new OAuth2Client({ clientId: client_id, clientSecret: client_secret });
const jwt = require("jsonwebtoken");
const async = require("async");
const client = require("../../config/client");
const userModel = require("../../models/user.model");
const logoutTokenModel = require("../../models/logout-token.model");
const wordModel = require("../../models/word.model");

const completeOAuthSignIn = (req, res) => {
    let { idToken, method } = req.query;
    async.waterfall([
        cb => {
            if(!idToken || !method){
                cb({
                    msg: "idToken or method missing in request params"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            switch(method){
                case "google":
                    googleOAuthClient.verifyIdToken({
                        idToken: idToken,
                        audience: client_id
                    }).then(ticket => {
                        const payload = ticket.getPayload()
                        const user = {
                            email: payload.email,
                            firstName: payload.given_name,
                            lastName: payload.family_name
                        };
                        cb(null, user);
                    }).catch(error => cb(error));
                    break;
                default:
                    cb({
                        msg: "Invalid method"
                    });
                    break;
            }
        },
        (user, cb) => {
            userModel.findOne({ email: user.email })
            .then(async userDoc => {
                let currentUser = userDoc;
                if(!userDoc){
                    let newUser = new userModel(user);
                    try{
                        currentUser = await newUser.save();
                    }catch(error){
                        cb(error);
                        return;
                    }
                }
                let token = jwt.sign(currentUser.toJSON(), client_secret, { expiresIn: "12h" });
                cb(null, token);
            })
        }
    ], (error, token) => {
        if(error) res.status(500).json(error);
        else res.status(200).json({ token });
    });
};

const checkToken = (req, res, next) => {
    let { token } = req.query;
    async.waterfall([
        cb => {
            if(!token){
                cb({
                    msg: "Token Missing!"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            logoutTokenModel.countDocuments({ token: token })
            .then(count => {
                if(count){
                    cb({
                        msg: "Token Expired!"
                    });
                } else{
                    cb(null);
                }
            })
            .catch(error => {
                cb(error);
            });
        },
        cb => {
            jwt.verify(token, client_secret, (error, user) => {
                if(error){
                    cb(error);
                } else{
                    req.user = user;
                    cb(null);
                }
            });
        },
        cb => {
            let user = req.user;
            if(!checkUserTrie(user._id)){
                addUserTrie(user._id);
                wordModel.find({ user: user._id })
                .select({ name: 1})
                .then(docs => {
                    docs.forEach(doc => trie.insert(doc.name, user._id));
                    cb(null);
                })
                .catch(error => {
                    cb(error);
                });
            } else{
                cb(null);
            }
        }
    ], error => {
        if(error) res.status(500).json(error);
        else next();
    });
};

const isAuthenticated = (req, res) => {
    res.status(200).json({ user: req.user });
};

const logout = (req, res) => {
    let { token } = req.query;
    async.waterfall([
        cb => {
            if(!token){
                cb({
                    msg: "Token Missing!"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            new logoutTokenModel({ token }).save()
            .then(() => {
                deleteUserTrie(req.user._id);
                cb(null);
            })
            .catch(error => {
                cb(error);
            });
        }
    ], error => {
        if(error) res,status(500).json(error);
        else res.status(200).json();
    });
};

module.exports = {
    completeOAuthSignIn,
    checkToken,
    isAuthenticated,
    logout
};