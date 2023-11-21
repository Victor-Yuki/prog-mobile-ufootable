import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-manageleagues',
  templateUrl: './manageleagues.page.html',
  styleUrls: ['./manageleagues.page.scss'],
})
export class ManageleaguesPage implements OnInit {
  teste:any;
  passedLeagueName: any;

  selectedLeague: any;
  teams= this.database.getTeams();
  createdLeagues = this.database.getCreatedLeagues();

  leagues = this.database.getLeagues();
  arrayOfTeams = this.database.getArrayOfTeams();
  playersG = this.database.getPlayersGoals();
  topPlayer:any;
  topTeam:any;
  topLeague:any;
  constructor(private route: ActivatedRoute,
    private router: Router, 
    private database: DatabaseService, 
    private nav: NavController) { }

  async ngOnInit() {
    console.log('Welcome to new page')
    const idInfo = this.route.snapshot.paramMap.get('id');
    console.log(idInfo);
    this.teste = (idInfo||'nada');
    let decoded = decodeURIComponent(idInfo || 'nada');
    let decodedParts = decoded.split('/');
    if (decodedParts.length > 0) {
      this.passedLeagueName = decodedParts[0];
      console.log(this.passedLeagueName);
      this.teste = (this.passedLeagueName);
    }
    await this.database.loadTeamsFromLeague(this.passedLeagueName);
    this.teams = this.database.getTeams();
  }

  async ionViewDidEnter(){
    console.log('Welcome Create New League.');
    console.log(this.arrayOfTeams());
    await this.database.loadArrayOfTeams(5);
    await this.database.loadTopPlayersGoalsAssists(5);
    console.log(this.arrayOfTeams());
    this.arrayOfTeams = this.database.getArrayOfTeams();
    this.playersG = this.database.getPlayersGoals();
    this.topLeague = this.leagues()[0].Name;
    this.topTeam = this.arrayOfTeams()[0][this.leagues()[0].Name][0].Name;
    this.topPlayer = this.playersG()[0].Name;
  }

  goManageTeam(teamName:any){
    console.log('clicou em go manage team: '+teamName, this.selectedLeague);
    this.nav.navigateForward('/manageteams', {state: {team: teamName, league:this.selectedLeague}});
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
    console.log(`${leagueName}/${teamName}`, encoded);
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

  goHome(){
    this.router.navigate(['home']);
  }

  async handleChange(e:any) {
    console.log('ionChange fired with value: ' + e.detail.value);
    //this.nav.navigateForward('/manageleagues', {state: e.detail.value});
    this.reloadPageInfo(e.detail.value);
    //this.goManageLeagues(e.detail.value);
  }

  async reloadPageInfo(leagueName: any){
    await this.database.loadTeamsFromLeague(String(leagueName));
    this.teams = this.database.getTeams();
    this.selectedLeague = leagueName;
    this.passedLeagueName = leagueName;
    console.log('depois de reloadPageInfo()');
  }



}
