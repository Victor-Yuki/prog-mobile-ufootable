import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-manageteams',
  templateUrl: './manageteams.page.html',
  styleUrls: ['./manageteams.page.scss'],
})
export class ManageteamsPage implements OnInit {
  teste: any;
  passedTeamName: any;
  passedLeagueName: any;

  teams = this.database.getTeams();
  leagues = this.database.getLeagues();
  players = this.database.getPlayers();
  selectedLeague: any;
  //selectedLeagueName:string = "";
  selectedTeam = this.database.getSingleTeam();
  selectedTeamName: string = "";

  newTeamName: any;
  newTeamGf: any;
  newTeamGa: any;
  newTeamW: any;
  newTeamD: any;
  newTeamL: any;
  newTeamPart: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private database: DatabaseService,
    private alertCtrl: AlertController) { }

  async ngOnInit() {
    console.log('Welcome to new page')
    const idInfo = this.route.snapshot.paramMap.get('id');
    console.log(idInfo);
    this.teste = (idInfo || 'nada');
    let decoded = decodeURIComponent(idInfo || 'nada');
    let decodedParts = decoded.split('/');
    if (decodedParts.length > 0) {
      this.passedLeagueName = decodedParts[0];
      this.passedTeamName = decodedParts[1];
      console.log(this.passedLeagueName, this.passedTeamName);
    }
    await this.database.loadTeamsFromLeague(this.passedLeagueName);
    await this.database.loadPlayersFromTeam(this.passedTeamName);
    await this.database.loadLeagues();
    this.teams = this.database.getTeams();
    this.players = this.database.getPlayers();
    this.leagues = this.database.getLeagues();
    await this.database.loadTeamFromName(this.passedTeamName);
    this.selectedTeam = this.database.getSingleTeam();
    this.selectedTeamName = this.passedTeamName;
    this.changeInputValues();
  }

  changeInputValues() {
    this.newTeamName = String(this.selectedTeam()[0].Name);
    this.newTeamGf = this.selectedTeam()[0].GF;
    this.newTeamGa = this.selectedTeam()[0].GA;
    this.newTeamW = this.selectedTeam()[0].Win;
    this.newTeamD = this.selectedTeam()[0].Draw;
    this.newTeamL = this.selectedTeam()[0].Loss;
    this.newTeamPart = this.selectedTeam()[0].Matches;

    console.log(this.selectedTeam()[0])
    console.log('newTeamValues: ' + this.newTeamName, this.newTeamPart, this.newTeamGf, this.newTeamGa, this.newTeamW, this.newTeamD, this.newTeamL);
    console.log('depois de changeinputvalues()');
  }

  handleChangeTeam(ev: any) {
    console.log('handle change team: ' + ev.detail.value);
    this.reloadPageInfoTeam(ev.detail.value);
  }
  handleChangeLeague(ev: any) {
    console.log('handle change league: ' + ev.detail.value);
    this.reloadPageInfoLeague(ev.detail.value);
  }

  async reloadPageInfoLeague(leagueName: any) {
    await this.database.loadTeamsFromLeague(String(leagueName));
    this.teams = this.database.getTeams();
    this.selectedLeague = leagueName;
    this.passedLeagueName = leagueName;
    console.log('depois de reloadPageInfoLeague()');
  }
  async reloadPageInfoTeam(teamName: any) {
    await this.database.loadPlayersFromTeam(String(teamName));
    await this.database.loadTeamFromName(String(teamName));
    this.players = this.database.getPlayers();
    this.selectedTeam = this.database.getSingleTeam();
    this.selectedTeamName = this.selectedTeam()[0].Name;
    this.passedTeamName = this.selectedTeam()[0].Name;
    this.changeInputValues();
    console.log('depois de reloadPageInfoTeam()');
  }

  async updateTeam() {
    console.log('clicou em update team: ' + this.newTeamName, this.newTeamGf, this.newTeamGa, this.newTeamW, this.newTeamD, this.newTeamL);
    if (this.newTeamName === '' || this.newTeamW === "" || this.newTeamD === ""
      || this.newTeamL === "" || this.newTeamGf === "" || this.newTeamGa === "") {
      await this.presentAlert('Preencha todos os campos');
    } else {
      await this.database.updateTeam(this.passedTeamName, this.newTeamName, this.newTeamW, this.newTeamD, this.newTeamL, this.newTeamGf, this.newTeamGa);
      this.selectedTeamName = this.newTeamName;
      this.passedTeamName = this.newTeamName;
      await this.database.loadTeamsFromLeague(this.passedLeagueName);
      this.teams = this.database.getTeams();
      await this.reloadPageInfoTeam(this.selectedTeamName);
    }
  }

  async deleteTeam() {
    console.log('clicou em deletar team: ' + this.selectedTeamName);
    let confirm = await this.warningAlert('Tem certeza que deseja deletar esse time? (Todos os jogadores realiconados com esse time também serão deletados).');
    if (confirm) {
      console.log('deleting team: ' + this.selectedTeamName);
      await this.database.deleteTeam(this.selectedTeamName);
      await this.database.loadTeamsFromLeague(this.selectedLeague);
      this.teams = this.database.getTeams();
      this.clearAfterDelete();
      await this.database.loadPlayersFromTeam('');
      this.players = this.database.getPlayers();
    }
  }

  async addTeam() {
    console.log('clicou em add team: ' + this.selectedLeague);
    console.log('values to add: '+ this.newTeamName, this.newTeamW, this.newTeamD, this.newTeamL, this.newTeamGf, this.newTeamGa)
    /*console.log(this.newTeamName == "")
    console.log(String(this.newTeamW) == "" )
    console.log(this.newTeamD === "")
    console.log(this.newTeamL == "")
    console.log(this.newTeamGf == "")
    console.log(this.newTeamGa == "")*/

    if (this.newTeamName === "" || this.newTeamW === "" || this.newTeamD === "" 
    || this.newTeamL === "" || this.newTeamGf === "" || this.newTeamGa === "") {
      await this.presentAlert('Preencha todos os campos');
    } else {
      let result = await this.database.checkTeam(this.newTeamName);
      if(result){
        let confirm = await this.warningAlert('Tem certeza que deseja adicionar esse time na liga: ' + this.selectedLeague + '?');
        if (confirm) {
          this.database.addTeam(this.selectedLeague, this.newTeamName, this.newTeamW, this.newTeamD, this.newTeamL, this.newTeamGf, this.newTeamGa);
          await this.database.loadTeamsFromLeague(this.selectedLeague);
          this.teams = this.database.getTeams();
          this.clearAfterDelete();
          await this.database.loadPlayersFromTeam('');
          this.players = this.database.getPlayers();
        }
      } else{
        await this.presentAlert('Já existe um time com esse nome cadastrado.');
      }
    }
  }

  clearAfterDelete() {
    this.newTeamName = "";
    this.newTeamGf = "";
    this.newTeamGa = "";
    this.newTeamW = "";
    this.newTeamD = "";
    this.newTeamL = "";
    this.newTeamPart = "";
    this.selectedTeamName = "Select another team";
  }

  async presentAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async warningAlert(msg: string) {
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

  goManageTeams() {
    const encoded = encodeURIComponent('Premier League/Manchester United');
    //this.router.navigateByUrl(`/newLeague/${encoded}`);
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

}
