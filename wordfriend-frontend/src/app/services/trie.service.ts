import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { word } from '../app.model';

const uri = "/api/trie";

@Injectable({
  providedIn: 'root'
})
export class TrieService {

  constructor(private http:HttpClient) { }

  insert(words:word[]){
    return this.http.put<any>(`${uri}/insert`, { words });
  }

  search(word:string){
    return this.http.head(`${uri}/search/${word}`);
  }

  details(word:string){
    return this.http.get<any>(`${uri}/details/${word}`);
  }

  delete(word:string){
    return this.http.delete(`${uri}/remove/${word}`);
  }

  getAllWords(){
    return this.http.get<any>(`${uri}/getAllWords`);
  }

  getStartsWith(char:string){
    return this.http.get<any>(`${uri}/getStartsWith/${char}`);
  }

  multiDetails(words){
    return this.http.post<any>(`${uri}/multiDetails`, { words });
  }

  update(word:word){
    return this.http.post<any>(`${uri}/update`, { word });
  }
}
