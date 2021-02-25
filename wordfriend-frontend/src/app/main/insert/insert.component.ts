import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { word } from 'src/app/app.model';
import { AuthService } from 'src/app/services/auth.service';
import { TrieService } from 'src/app/services/trie.service';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit, OnDestroy {

  words: word[] = [];
  target: string = "";
  routeUrlSubscription: Subscription = null;
  routeParamsSubscription: Subscription = null;
  wordToEdit: string = null;
  deleteWord: boolean = false;
  logout: boolean = false;

  constructor(
    public trie: TrieService,
    private toastr:ToastrService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private router: Router
  ) {
    this.routeUrlSubscription = this.route.url.subscribe(url => {
      this.target = url[0].path;
      this.newWord();
      if(this.target==="edit"){
        this.routeParamsSubscription = this.route.params.subscribe(params => {
          this.wordToEdit = params.wordToEdit;
          if(!this.wordToEdit){
            this.toastr.warning("No Word given to edit");
            this.goBack();
          } else{
            this.trie.details(this.wordToEdit).toPromise()
            .then(response => {
              this.words[0] = {
                name: response.name,
                meaning: response.meaning,
                example: response.example
              };
            })
            .catch(error => {
              this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Retrieving Word Details!");
            });
          }
        });
      }
    });
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(){
    if(this.routeUrlSubscription) this.routeUrlSubscription.unsubscribe();
  }

  goBack(){
    this.router.navigate(["main","home"])
  }

  newWord(){
    this.words.push({
      name: "",
      meaning: "",
      example: ""
    });
  }

  addWords(){
    if(this.target==="add"){
      this.trie.insert(this.words).toPromise()
      .then(() => {
        this.toastr.success("Added the Given Words!");
        this.goBack();
      })
      .catch(error => {
        this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Adding Words!");
      });
    }else{
      this.trie.update(this.words[0]).toPromise()
      .then(() => {
        this.toastr.success("Updated!");
        this.goBack();
      })
      .catch(error => {
        this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Adding Words!");
      });
    }
  }

  delete(word){
    this.trie.delete(word).toPromise()
    .then(() => {
      this.toastr.info("Word Deleted!");
      this.goBack();
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Adding Words!");
    }).finally(() => {
      this.deleteWord = false;
    });
  }

  incomplete(){
    return this.words.length===0 || this.words.find(word => !word.name || !word.meaning);
  }

}
