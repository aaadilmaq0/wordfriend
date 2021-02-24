const wordModel = require("./models/word.model");
const Stack = require("stack-lifo");

function node(){
    this.end = false;
    this.children = {};
};

function dictionary(){
    this.children = {};
};

global.trie = new dictionary();

global.checkUserTrie = user => {
    return trie.children[user];
};

global.addUserTrie = user => {
    trie.children[user] = new dictionary();
};

global.deleteUserTrie = user => {
    delete trie.children[user];
};

dictionary.prototype.insert = (word,user) => {
    let curr = trie.children[user];
    for(let i = 0; i < word.length; i++){
        let char = word.charAt(i);
        if(!curr.children[char]) curr.children[char] = new node();
        curr = curr.children[char];
    }
    curr.end = true;
};

dictionary.prototype.search = (word,user) => {
    let curr = trie.children[user];
    for(let i = 0; i < word.length; i++){
        let char = word.charAt(i);
        if(!curr.children[char]) return false;
        curr = curr.children[char];
    }
    return curr && curr.end;
};

dictionary.prototype.remove = (word,user) => {
    let nodestack = new Stack();
    let charstack = new Stack();
    let curr = trie.children[user];
    nodestack.push(curr);
    for(let i = 0; i < word.length; i++){
        let char = word.charAt(i);
        charstack.push(char);
        nodestack.push(curr.children[char]);
        curr = curr.children[char];
    }
    let l = nodestack.size();
    while(nodestack.size()>1){
        let currNode = nodestack.pop();
        let currChar = charstack.pop();
        let parentNode = nodestack.pop();
        if(nodestack.size() === l-2) currNode.end = false;
        else if(currNode.end) return;
        if(Object.keys(currNode).length > 0) return;
        delete parentNode.children[currChar];
        nodestack.push(parentNode);
    }
};

dictionary.prototype.getAllWords = user => {
    let words = [];
    let curr = trie.children[user];
    findAllWords(curr, words, "");
    return words;
};

dictionary.prototype.getStartsWith = (char, user) => {
    let words = [];
    let curr = trie.children[user];
    if(!curr.children || !curr.children[char]) return words;
    findAllWords(curr.children[char], words, char);
    return words;
};

const findAllWords = (curr, words, currentWord) => {
    if(currentWord && curr.end){
        words.push(currentWord);
    }
    if(!curr.children) return;
    let keys = Object.keys(curr.children);
    keys = keys.sort();
    for(let key of keys){
        findAllWords(curr.children[key], words, currentWord+key);
    }
};