import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TrieService } from 'src/app/services/trie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  all: string = "⁎";
  letters = "abcdefghijklmnopqrstuvwxyz".split("");
  allWords: string[] = [];
  selectedChar: string = "";
  selectedWords = {};
  wordToDelete: string = null;
  search: boolean = false;
  searchText: string = "";

  constructor(
    public auth:AuthService,
    private trie:TrieService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    setInterval(()=>console.log(this.searchText),1000)
    this.selectedChar = this.all;
    this.getWords();
  }

  getWords(){
    let caller = this.selectedChar==="⁎" ? this.trie.getAllWords() : this.trie.getStartsWith(this.selectedChar);
    caller.toPromise()
    .then(response => {
      this.allWords = response.words;
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error!");
    });
  }

  getWordDetails(word){
    if(!this.selectedWords[word]){
      this.trie.details(word).toPromise()
      .then(response => {
        this.selectedWords[word] = {
          name: response.name,
          meaning: response.meaning,
          example: response.example
        };
      })
      .catch(error => {
        this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error!");
      });
    }else{
      delete this.selectedWords[word];
    }
  }

  canExpandAll(){
    return this.allWords.find(word =>!this.selectedWords[word]);
  }

  expandAll(){
    this.trie.multiDetails(this.allWords).toPromise()
    .then(response => {
      this.selectedWords = response;
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error!");
    });
  }

  delete(word){
    this.trie.delete(word).toPromise()
    .then(() => {
      this.toastr.info("Word Deleted!");
      this.getWords();
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error!");
    })
    .finally(() => {
      this.wordToDelete = null;
    });
  }

  startSearch(){
    this.selectedChar = this.all;
    this.getWords();
    this.search = true;
  }

  handleSearchText(event){
    this.searchText = event.target.value;
  }

  getAllWords(){
    if(this.search && this.searchText){
      return this.allWords.filter(word => new RegExp(this.searchText,"i").test(word));
    } else{
      return this.allWords;
    }
  }

  closeSearch(){
    this.search = false;
    this.searchText = "";
  }

  logout(){
    this.auth.startLogout().toPromise()
    .then(() => {
      this.auth.logout();
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Logging Out!");
    });
  }

}
