import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-manageplayers',
  templateUrl: './manageplayers.page.html',
  styleUrls: ['./manageplayers.page.scss'],
})
export class ManageplayersPage implements OnInit {
  teste: any;
  passedLeagueName: any;
  passedTeamName: any;
  passedPlayerName: any;

  teams = this.database.getTeams();
  leagues = this.database.getLeagues();
  players = this.database.getPlayers();
  selectedLeague: any;
  //selectedLeagueName:string = "";
  selectedTeam = this.database.getSingleTeam();
  selectedTeamName: string = "";
  selectedPlayer = this.database.getSinglePlayer();
  selectedPlayerName: string = '';

  newPlayerName: any;
  newPlayerNation: any;
  newPlayerAge: any;
  newPlayerMatches: any;
  newPlayerStarts: any;
  newPlayerMinutes: any;
  newPlayerGoals: any;
  newPlayerAssists: any;
  newPlayerPosition: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private database: DatabaseService,
    private nav: NavController,
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
      this.passedPlayerName = decodedParts[2];
      console.log(this.passedLeagueName, this.passedTeamName, this.passedPlayerName);
      this.teste = (this.passedLeagueName, this.passedTeamName, this.passedPlayerName);
    }
    await this.database.loadTeamsFromLeague(this.passedLeagueName);
    await this.database.loadPlayersFromTeam(this.passedTeamName);
    await this.database.loadPlayerFromNameTeam(this.passedTeamName, this.passedPlayerName);
    this.teams = this.database.getTeams();
    this.players = this.database.getPlayers();
    this.leagues = this.database.getLeagues();
    await this.database.loadTeamFromName(this.passedTeamName);
    this.selectedTeam = this.database.getSingleTeam();
    this.selectedTeamName = this.passedTeamName;
    this.selectedPlayer = this.database.getSinglePlayer();
    this.selectedPlayerName = this.passedPlayerName;
    this.changeInputValues();
  }

  changeInputValues() {
    let p = this.selectedPlayer()[0];
    this.newPlayerName = this.selectedPlayerName;
    this.newPlayerNation = p.Nation;
    this.newPlayerAge = p.Age;
    this.newPlayerMatches = p.Matches;
    this.newPlayerStarts = p.Starts;
    this.newPlayerMinutes = p.Minutes;
    this.newPlayerGoals = p.Goals;
    this.newPlayerAssists = p.Assists;
    this.newPlayerPosition = p.Position;

    console.log(p);
    console.log('depois do changeInputValues()');
  }

  clearAfterDelete() {
    this.newPlayerName = "";
    this.newPlayerNation = "";
    this.newPlayerAge = 0;
    this.newPlayerMatches = 0;
    this.newPlayerStarts = 0;
    this.newPlayerMinutes = 0;
    this.newPlayerGoals = 0;
    this.newPlayerAssists = 0;
    this.newPlayerPosition = "";
    this.selectedPlayerName = "Select another player"
  }

  async updatePlayer() {
    console.log('clicou em update player: ' + this.newPlayerName);
    if (this.newPlayerName === "" || this.newPlayerNation === "" || this.newPlayerAge === "" || this.newPlayerMatches === "" || this.newPlayerStarts === "" || this.newPlayerMinutes === "" || this.newPlayerGoals === "" || this.newPlayerAssists === "" || this.newPlayerPosition === "") {
      await this.presentAlert('Preencha todos os campos');
    } else {
      const query = (`UPDATE player SET 
      Name="${this.newPlayerName}", Nation="${this.newPlayerNation}", Age="${this.newPlayerAge}", Matches="${this.newPlayerMatches}",
      Starts="${this.newPlayerStarts}", Minutes="${this.newPlayerMinutes}", Goals="${this.newPlayerGoals}", Assists="${this.newPlayerAssists}", Position="${this.newPlayerPosition}"
      WHERE Name="${this.selectedPlayerName}" AND Team="${this.selectedTeamName}";`);
      console.log(query);
      await this.database.updatePlayer(this.selectedTeamName, this.selectedPlayerName, this.newPlayerName, this.newPlayerNation, this.newPlayerAge, this.newPlayerMatches, this.newPlayerStarts, this.newPlayerMinutes, this.newPlayerGoals, this.newPlayerAssists, this.newPlayerPosition);
      this.selectedPlayerName = this.newPlayerName;
      this.passedPlayerName = this.newPlayerName;
      await this.database.loadPlayersFromTeam(this.selectedTeamName);
      await this.reloadPageInfoPlayer(this.selectedPlayerName);
    }
  }

  async deletePlayer() {
    console.log('clicou em delete player: ' + this.newPlayerName);
    let confirm = await this.warningAlert('Tem certeza que deseja deletar esse jogador permanentemente?');
    if (confirm) {
      await this.database.deletePlayer(this.newPlayerName, this.selectedTeamName);
      await this.database.loadPlayersFromTeam(this.selectedTeamName);
      //await this.reloadPageInfoPlayer(this.selectedPlayerName);
      this.clearAfterDelete();
    }
  }

  async addPlayer() {
    console.log('clicou em add player: ' + this.newPlayerName);
    if (this.newPlayerName === "" || this.newPlayerNation === "" || this.newPlayerAge === "" || this.newPlayerMatches === "" || this.newPlayerStarts === "" || this.newPlayerMinutes === "" || this.newPlayerGoals === "" || this.newPlayerAssists === "" || this.newPlayerPosition === "") {
      await this.presentAlert('Preencha todos os campos');
    } else {
      let result = await this.database.checkPlayer(this.selectedTeamName, this.newPlayerName);
      if (result) {
        let confirm = await this.warningAlert("Tem certeza que desja adicionar esse jogador no time: " + this.selectedTeamName + "?");
        if (confirm) {
          await this.database.addPlayer(this.selectedTeamName, this.newPlayerName, this.newPlayerNation, this.newPlayerAge, this.newPlayerMatches, this.newPlayerStarts, this.newPlayerMinutes, this.newPlayerGoals, this.newPlayerAssists, this.newPlayerPosition);
          await this.database.loadPlayersFromTeam(this.selectedTeamName);
          this.players = this.database.getPlayers();
          this.clearAfterDelete();
        }
      }
    }
  }

  handleChangeTeam(ev: any) {
    console.log('handle change team: ' + ev.detail.value);
    this.reloadPageInfoTeam(ev.detail.value);
  }
  handleChangeLeague(ev: any) {
    console.log('handle change league: ' + ev.detail.value);
    this.reloadPageInfoLeague(ev.detail.value);
  }
  handleChangePlayer(ev: any) {
    console.log('handle change player: ' + ev.detail.value);
    this.reloadPageInfoPlayer(ev.detail.value);
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
    //this.changeInputValues();
    console.log('depois de reloadPageInfoTeam()');
  }
  async reloadPageInfoPlayer(playerName: any) {
    await this.database.loadPlayerFromNameTeam(this.selectedTeamName, playerName);
    this.selectedPlayer = this.database.getSinglePlayer();
    this.selectedPlayerName = this.selectedPlayer()[0].Name;
    this.passedPlayerName = this.selectedPlayer()[0].Name;
    this.changeInputValues();
    console.log('depois de reloadPageInfoPlayer()');
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

}
