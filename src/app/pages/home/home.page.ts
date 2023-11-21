import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage implements OnInit {
  players = this.database.getPlayers();
  teams = this.database.getTeams();
  leagues = this.database.getLeagues();

  teamsBr = this.database.getTeamsBr();
  teamsPL = this.database.getTeamsPL();
  arrayOfTeams = this.database.getArrayOfTeams();
  playersG = this.database.getPlayersGoals();
  playersA = this.database.getPlayersAssists();

  constructor(private database: DatabaseService, private nav: NavController, private router: Router) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    console.log('Welcome Home.');
    console.log(this.arrayOfTeams());
    await this.database.loadArrayOfTeams(5);
    await this.database.loadTopPlayersGoalsAssists(5);
    console.log(this.arrayOfTeams());
    this.arrayOfTeams = this.database.getArrayOfTeams();
    this.playersG = this.database.getPlayersGoals();
    this.playersA = this.database.getPlayersAssists();
  }

  async loadPlayers(team:string){
    console.log('clicou em: ' + team);
    await this.database.loadPlayersFromTeam(team);
    this.players = this.database.getPlayers();
  }

  async loadTeams(league:string){
    console.log('clicou em: '+league);
    await this.database.loadTeamsFromLeague(league);
    this.teams = this.database.getTeams();
  }

  async loadTop5(category:string){
    console.log('clicou em top 5')
    await this.database.loadTopPlayersFromCategory(category);
    this.players = this.database.getPlayers();
  }

  async goNewLeague(){
    this.router.navigate(['newleague/new']);
  }

  async goManageLeagues(leagueName:any){
    console.log('clicou em manage leagues: ' + leagueName);
    //this.nav.navigateForward('/manageleagues',{state: leagueName});
    const encoded = encodeURIComponent(`${leagueName}`);
    this.router.navigate([`manageleagues/${encoded}`]);
  }

  async goManageTeams(teamName:any, leagueName:any){
    console.log('clicou em manage teams: ' + teamName, leagueName);
    //this.nav.navigateForward('/manageteams', {state: {team: teamName, league: leagueName}});
    const encoded = encodeURIComponent(`${leagueName}/${teamName}`);
    this.router.navigate([`manageteams/${encoded}`]);
  }

  async goManagePlayers(playerName:any, teamName:any){
    console.log('clicou em manage players: ' + playerName, teamName);
    await this.database.loadTeamFromName(teamName);
    let team = this.database.getSingleTeam();
    let leagueName = team()[0].League;
    //this.nav.navigateForward('/manageplayers', {state: {team: teamName, league: leagueName, player: playerName}});
    const encoded = encodeURIComponent(`${leagueName}/${teamName}/${playerName}`);
    this.router.navigate([`manageplayers/${encoded}`]);
  }

  teste(name:any){
    console.log('clicou em '+name);
  }

}
