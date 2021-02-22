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

dictionary.prototype.insert = word => {
    let curr = trie;
    for(let i = 0; i < word.length; i++){
        let char = word.charAt(i);
        if(!curr.children[char]) curr.children[char] = new node();
        curr = curr.children[char];
    }
    curr.end = true;
};

dictionary.prototype.search = word => {
    let curr = trie;
    for(let i = 0; i < word.length; i++){
        let char = word.charAt(i);
        if(!curr.children[char]) return false;
        curr = curr.children[char];
    }
    return curr && curr.end;
};

dictionary.prototype.remove = word => {
    let nodestack = new Stack();
    let charstack = new Stack();
    let curr = trie;
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

wordModel.find().select({ name: 1 })
.then(docs => {
    docs.forEach(doc=>{
        trie.insert(doc.name);
    });
})
.catch(error => {
    console.log(error);
    process.exit(1);
});