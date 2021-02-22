const async = require("async");
const wordModel = require("./models/word.model");

module.exports = app => {
    app.use("/api/auth", require("./api/auth"));
    app.put("/insert", insert);
    app.head("/search/:word", search);
    app.get("/details/:word", details);
    app.delete("/remove/:word", remove);
};

const insert = (req, res) => {
    let { word } = req.body;
    async.waterfall([
        cb => {
            if(!word || !word.name || !word.meaning){
                cb({
                    msg: "Word { name, meaning } required in Body!"
                });
            } else{
                trie.insert(word.name);
                cb(null);
            }
        },
        cb => {
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
    if(trie.search(word)) res.status(200).send();
    else res.status(500).send();
};

const details = (req, res) => {
    let word = req.params.word;
    async.waterfall([
        cb => {
            if(!trie.search(word)){
                cb({
                    msg: "Word Not Found"
                });
            } else{
                cb(null);
            }
        },
        cb => {
            wordModel.findOne({ name: word })
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
            if(!trie.search(word)){
                cb({
                    msg: "Word Not Found"
                });
            } else{
                trie.remove(word);
                cb(null);
            }
        },
        cb => {
            wordModel.remove({ name: word })
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