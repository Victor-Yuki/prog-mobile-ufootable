import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-newleague',
  templateUrl: './newleague.page.html',
  styleUrls: ['./newleague.page.scss'],
})
export class NewleaguePage implements OnInit {
  teste:any;
  newLeagueName: string = "";
  createdLeagues = this.database.getCreatedLeagues();

  leagues = this.database.getLeagues();
  arrayOfTeams = this.database.getArrayOfTeams();
  playersG = this.database.getPlayersGoals();
  topPlayer:any;
  topTeam:any;
  topLeague:any;

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private alertCtrl: AlertController, 
    private database: DatabaseService, 
    private nav:NavController) { }

  ngOnInit() {
    console.log('Welcome to new page')
    this.database.loadCreatedLeagues();
    this.createdLeagues = this.database.getCreatedLeagues();
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

  async createLeague(){
    console.log('clicou em create league');
    console.log(this.createdLeagues()[0].Name);
    if (this.newLeagueName == ''){
      this.presentAlert('O nome da liga está vazio.');
    }else{
      console.log('O nome da liga escrito foi: ' + this.newLeagueName);
      let result = await this.database.checkLeague(this.newLeagueName);
      if(result){ // se vazio = não existe liga com o nome;
        let result = this.database.addLeague(this.newLeagueName);
        console.log(result);
        this.newLeagueName="";
        this.presentAlert('Liga cadastrada com sucesso.');
        this.database.loadCreatedLeagues();
        this.createdLeagues = this.database.getCreatedLeagues();
      } else{
        this.presentAlert('Já existe uma liga com este nome cadastrada.');
      }
      //this.router.navigate(['home']);  
    }
    
  }

  async deleteLeague(leagueName:string){
    console.log('clicou em delete League: '+ leagueName);
    const confirm = await this.warningAlert('Tem certeza que deseja deletar esta liga? (Todos os times e jogadores realicionados também serão deletados.)');
    if(confirm){
      await this.database.deleteLeague(leagueName);
      //await this.presentAlert('Liga deletada com sucesso.');
      await this.database.loadCreatedLeagues();
      this.createdLeagues = this.database.getCreatedLeagues();
    }
    
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

  async presentAlert(msg:string) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async warningAlert(msg: string){
    return new Promise(async (resolve) => {
      const confirm = await this.alertCtrl.create({
        header: 'Confirm',
        subHeader: 'Important message',
        message: msg,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'OK',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  
  }

  goHome(){
    this.router.navigate(['']); 
  }

}
