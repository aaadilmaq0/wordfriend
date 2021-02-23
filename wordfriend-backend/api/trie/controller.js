const async = require("async");
const wordModel = require("../../models/word.model");

const insert = (req, res) => {
    let { word } = req.body;
    async.waterfall([
        cb => {
            if(!word || !word.name || !word.meaning){
                cb({
                    msg: "Word { name, meaning } required in Body!"
                });
            } else{
                trie.insert(word.name, req.user._id);
                cb(null);
            }
        },
        cb => {
            word.user = req.user._id;
            let newTrieDoc = new wordModel(word);
            newTrieDoc.save()
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

module.exports = {
    insert,
    search,
    details,
    remove
};