


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';


// interfaz de usuario de github 
interface GitHubUser{
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  public_repos: number;
}

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css',
  standalone: true
})


export class QuienSoyComponent implements OnInit {

  userData = signal<GitHubUser | null>(null);

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchGitHubData();
  }

  fetchGitHubData() {
    this.http.get<GitHubUser>('https://api.github.com/users/lucag316')
      .subscribe({
        next: (data) => {
          this.userData.set(data);
        },
        error: (error) => {
          console.error("ERROR fetching GitHub data:", error);
        }
      });
  }

}
