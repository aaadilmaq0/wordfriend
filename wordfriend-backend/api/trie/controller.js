const async = require("async");
const wordModel = require("../../models/word.model");

const insert = (req, res) => {
    let { words } = req.body;
    async.waterfall([
        cb => {
            if(!words || words.find(word => !word.name || !word.meaning)){
                cb({
                    msg: "Word { name, meaning } required in Body!"
                });
            } else{
                for(let word of words) trie.insert(word.name, req.user._id);
                cb(null);
            }
        },
        cb => {
            let f = [];
            for(let word of words){
                f.push(cb2 => {
                    word.user = req.user._id;
                    let newTrieDoc = new wordModel(word);
                    newTrieDoc.save()
                    .then(() => {
                        cb2(null);
                    })
                    .catch(error => {
                        cb2(error);
                    });
                });
            }
            async.parallelLimit(f, 5, error => {
                if(error) cb(error);
                else cb(null);
            });
        }
    ], error => {
        if(error) res.status(500).json(error);
        else res.status(200).json();
    });
};

const search = (req, res) => {
    let word = req.params.word;
    if(trie.search(word, req.user._id)) res.status(200).send();
    else res.status(500).send();
};

const details = (req, res) => {
    let word = req.params.word;
    async.waterfall([
        cb => {
            if(!trie.search(word, req.user._id)){
                cb({
                    msg: "Word Not Found"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            wordModel.findOne({ name: word, user: req.user._id })
            .then(doc => {
                cb(null, doc);
            })
            .catch(error => {
                cb(error);
            })
        }
    ], (error, result) => {
        if(error) res.status(500).json(error);
        else res.status(200).json(result);
    });
};

const remove = (req, res) => {
    let word = req.params.word;
    async.waterfall([
        cb => {
            if(!trie.search(word, req.user._id)){
                cb({
                    msg: "Word Not Found"
                });
            } else{
                trie.remove(word, req.user._id);
                cb(null);
            }
        },
        cb => {
            wordModel.deleteOne({ name: word, user: req.user._id })
            .then(() => {
                cb(null);
            })
            .catch(error => {
                cb(error);
            });
        }
    ], error => {
        if(error) res.status(500).json(error);
        else res.status(200).json();
    });
};

const update = (req, res) => {
    let { word } = req.body;
    async.waterfall([
        cb => {
            if(!word || !word.name || !word.meaning){
                cb({
                    msg: "Word { name, meaning } required in Body!"
                })
            } else{
                cb(null);
            }
        },
        cb => {
            if(!trie.search(word.name, req.user._id)){
                cb({
                    msg: "Word Not Found"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            wordModel.findOneAndUpdate({ name: word.name }, word)
            .then(() => {
                cb(null);
            })
            .catch(error => {
                cb(error);
            });
        }
    ], error => {
        if(error) res.status(500).json(error);
        else res.status(200).json();
    });
};

const getAllWords = (req, res) => {
    res.status(200).json({ words: trie.getAllWords(req.user._id) });
};

const getStartsWith = (req, res) => {
    res.status(200).json({ words: trie.getStartsWith(req.params.char, req.user._id) })
};

const multiDetails = (req, res) => {
    let { words } = req.body;
    async.waterfall([
        cb => {
            if(!words){
                cb({
                    msg: "words required in request body!"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            wordModel.find({
                $and:[
                    {
                        name:{
                            $in: words
                        }
                    },
                    {
                        user: req.user._id
                    }
                ]
            })
            .then(docs => {
                let details = {};
                for(let doc of docs) details[doc.name] = { meaning: doc.meaning, example: doc.example };
                cb(null, details);
            })
            .catch(error => {
                cb(error);
            });
        }
    ], (error, details) => {
        if(error) res.status(500).json(error);
        else res.status(200).json(details);
    });
};

module.exports = {
    insert,
    search,
    details,
    remove,
    getAllWords,
    getStartsWith,
    multiDetails,
    update
};