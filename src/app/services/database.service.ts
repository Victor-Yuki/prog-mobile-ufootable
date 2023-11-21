import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { DataService } from './data.service';
import { BehaviorSubject, from, of, switchMap } from 'rxjs';

const DB_NAME = 'dbTrabalho';
const DB_SETUP_KEY = 'toPopulate';

export interface Player {
  id: number;
  Name: string;
  Nation: string;
  Age: number;
  Matches: number;
  Starts: number;
  Minutes: number;
  Goals: number;
  Assists: number;
  Position: string;
  Team: string;
}

export interface Team {
  id: number;
  Name: string;
  Matches: number;
  Win: number;
  Draw: number;
  Loss: number;
  GF: number;
  GA: number;
  GD: number;
  Pts: number;
  League: string;
}

export interface League {
  id: number;
  Name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  dbReady = new BehaviorSubject(false);
  private players: WritableSignal<Player[]> = signal<Player[]>([]);
  private player: WritableSignal<Player[]> = signal<Player[]>([]);
  private teams: WritableSignal<Team[]> = signal<Team[]>([]);
  private team: WritableSignal<Team[]> = signal<Team[]>([]);
  private leagues: WritableSignal<League[]> = signal<League[]>([]);
  //private playersObj = {};

  private teamsBr: WritableSignal<Team[]> = signal<Team[]>([]);
  private teamsPL: WritableSignal<Team[]> = signal<Team[]>([]);
  private playersGoals: WritableSignal<Player[]> = signal<Player[]>([]);
  private playersAssists: WritableSignal<Player[]> = signal<Player[]>([]);
  //private arrayOfTeams: WritableSignal<[Team[]]> = signal<[Team[]]>([[]]);
  private arrayOfTeams: WritableSignal<any[]> = signal<any[]>([]);
  private arrayOfCreatedTeams: WritableSignal<any[]> = signal<any[]>([]);
  private createdLeagues: WritableSignal<League[]> = signal<League[]>([]);

  private topPlayer: WritableSignal<Player[]> = signal<Player[]>([]);
  private topPlayerTeam: WritableSignal<Team[]> = signal<Team[]>([]);
  private topTeam: WritableSignal<Team[]> = signal<Team[]>([]);
  private topLeague: WritableSignal<League[]> = signal<League[]>([]);

  constructor() { }

  async initializePlugin() {
    this.db = await this.sqlite.createConnection(
      DB_NAME,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    /*
      DROP TABLE IF EXISTS leagues;
      DROP TABLE IF EXISTS teams;
      DROP TABLE IF EXISTS players;
    */
    const tableSchema = `
      CREATE TABLE IF NOT EXISTS leagues(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Created INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS teams(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Matches INTEGER NOT NULL,
        Win INTEGER NOT NULL,
        Loss INTEGER NOT NULL,
        Draw INTEGER NOT NULL,
        GF INTEGER NOT NULL,
        GA INTEGER NOT NULL,
        GD INTEGER NOT NULL,
        Pts INTEGER NOT NULL,
        League TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS players(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Nation TEXT NOT NULL,
        Age INTEGER NOT NULL,
        Matches INTEGER NOT NULL,
        Starts INTEGER NOT NULL,
        Minutes INTEGER NOT NULL,
        Goals INTEGER NOT NULL,
        Assists INTEGER NOT NULL,
        Position TEXT NOT NULL,
        Team TEXT NOT NULL
      );
    `;

    await this.db.execute(tableSchema);

    console.log('tables created');
    //this.loadAll();
    this.loadPlayersFromTeam("Flamengo");
    this.loadLeagues();
    this.loadTeamsFromLeague("Premier League");

    this.loadTeamsBrPl(5);
    this.loadTopPlayersGoalsAssists(5);
    this.loadArrayOfTeams(5);
    this.loadArrayOfCreatedTeams(5);
    this.loadCreatedLeagues();
    this.loadTop();
    console.log('tables loaded: ' + (await Preferences.get({ key: DB_SETUP_KEY })).value);
    const dbSetupDone = await Preferences.get({ key: DB_SETUP_KEY });
    if (!dbSetupDone.value) {
      this.populateDB();
      console.log('tables populated');
      await Preferences.set({
        key: DB_SETUP_KEY,
        value: 'true'
      })
    } else {
      console.log('tables already populated: ' + (await Preferences.get({ key: DB_SETUP_KEY })).value);
    }
    //this.populateDB();

    this.dbReady.next(true);

    //console.log('Players: ' + this.players()[0].Name);
    return true;
  }

  async loadAll() {
    this.loadLeagues();
    this.loadPlayers();
    this.loadTeams();
    this.loadTopPlayersGoalsAssists(5);
    this.loadArrayOfTeams(5);
    this.loadArrayOfCreatedTeams(5);
    this.loadCreatedLeagues();
  }

  async loadTop() {
    const players = await this.db.query('SELECT * FROM players ORDER BY Goals DESC LIMIT 1;');
    this.topPlayer.set(players.values || []);
    const playerLeague = await this.db.query(`SELECT * FROM teams WHERE Name="${this.topPlayer()[0].Team}"`);
    this.topPlayerTeam.set(playerLeague.values || []);
    const teams = await this.db.query('SELECT * FROM teams ORDER BY Pts DESC LIMIT 1;');
    this.topTeam.set(teams.values || []);
    const leagues = await this.db.query('SELECT * FROM leagues LIMIT 1;');
    this.topLeague.set(leagues.values || []);
    console.log('end of load top');
    console.log(this.topPlayer);
    console.log(this.topPlayer());
  }

  async loadPlayers() {
    //const teamsNames = ['Fluminense', 'Palmeiras']

    const players = await this.db.query('SELECT * FROM players;');
    this.players.set(players.values || []);
    //Object.assign(this.playersObj,{"Fluminense": players});
  }

  async loadPlayersFromTeam(team: string) {
    const players = await this.db.query(`SELECT * FROM players WHERE Team="${team}"ORDER BY 
    case position
        WHEN 'Gol' then 0
          WHEN 'Def' then 1
          WHEN 'Mei' then 2
          WHEN 'Ata' then 3
       END`);
    this.players.set(players.values || []);
  }

  async loadPlayerFromNameTeam(team: string, playerName: string) {
    const player = await this.db.query(`SELECT * FROM players WHERE Team="${team}" AND Name="${playerName}"`);
    this.player.set(player.values || []);
  }

  async loadTopPlayersFromCategory(category: string) {
    const players = await this.db.query(`SELECT * FROM players ORDER BY "${category}" DESC LIMIT 15;`);
    this.players.set(players.values || []);
  }

  async loadTopPlayersGoalsAssists(limit: number) {
    const players1 = await this.db.query(`SELECT * FROM players ORDER BY goals DESC LIMIT ${limit};`);
    this.playersGoals.set(players1.values || []);
    const players2 = await this.db.query(`SELECT * FROM players ORDER BY assists DESC LIMIT ${limit};`);
    this.playersAssists.set(players2.values || []);
  }

  async loadTeams() {
    const teams = await this.db.query('SELECT * FROM teams');
    this.teams.set(teams.values || []);
  }

  async loadTeamFromName(teamName: string) {
    const team = await this.db.query(`SELECT * FROM teams WHERE Name="${teamName}";`);
    this.team.set(team.values || []);
  }

  async loadTeamsBrPl(limit: number) {
    const teams1 = await this.db.query(`SELECT * FROM teams WHERE league="Brasileirão" ORDER BY Pts Desc, GD DESC LIMIT ${limit};`);
    this.teamsBr.set(teams1.values || []);
    const teams2 = await this.db.query(`SELECT * FROM teams WHERE league="Premier League" ORDER BY Pts Desc, GD DESC LIMIT ${limit};`);
    this.teamsPL.set(teams2.values || []);
  }

  async loadTeamsFromLeague(league: string) {
    const teams = await this.db.query(`SELECT * FROM teams WHERE league='${league}' ORDER BY Pts DESC, gd DESC;`);
    this.teams.set(teams.values || []);
  }

  async loadArrayOfTeams(limit: number) {
    console.log('loading array of teams');
    const leagues = await this.db.query('SELECT * FROM leagues;');
    this.arrayOfTeams.set([]);
    for (let league of (leagues.values || [])) {
      let leagueName = league.Name;
      let teams = await this.db.query(`SELECT * FROM teams WHERE league="${leagueName}" 
          ORDER BY Pts Desc, GD DESC LIMIT ${limit};`);
      if((teams.values||[]).length > 0){
        console.log(teams.values||[]);
        let leagueObj = { [leagueName]: (teams.values || []) };
        this.arrayOfTeams.update(values => [...values, leagueObj]);
      }
    }
    console.log('end loading array of teams');
    /* console.log('finish load array of teams');
    console.log(this.arrayOfTeams());

    for(let league of this.arrayOfTeams()){
      console.log('for array of teams - begin');
      console.log(league);
      console.log('this is a league');
      console.log(this.leagues()[0]);
      console.log(league['Premier League']);
      console.log('for array of teams - end');
    }*/
  }

  async loadArrayOfCreatedTeams(limit: number) {
    const leagues = await this.db.query('SELECT * FROM leagues WHERE Created=1;');
    this.arrayOfCreatedTeams.set([]);
    for (let league of (leagues.values || [])) {
      let leagueName = league.Name;
      let teams = await this.db.query(`SELECT * FROM teams WHERE league="${leagueName}" ORDER BY Pts Desc, GD DESC LIMIT ${limit};`);
      let leagueObj = { [leagueName]: (teams.values || []) };
      this.arrayOfCreatedTeams.update(values => [...values, leagueObj]);
      console.log(leagueName);
    }
  }

  async loadLeagues() {
    const leagues = await this.db.query('SELECT * FROM leagues;');
    this.leagues.set(leagues.values || []);
  }

  async loadCreatedLeagues() {
    const leagues = await this.db.query('SELECT * FROM leagues WHERE Created=1;');
    this.createdLeagues.set(leagues.values || []);
    console.log('loaded created leagues');
    console.log(this.createdLeagues());
  }

  async populateDB() {
    const data = new DataService();
    const result = await this.db.execute(data.getPopulateQuery());
    this.loadAll();
    return result;
  }

  async checkLeague(leagueName: string) {
    let result = await this.db.query(`SELECT * FROM leagues WHERE Name="${leagueName}"`);
    return (result.values || []).length === 0;
  }

  async checkTeam(teamName: string) {
    let result = await this.db.query(`SELECT * FROM teams WHERE Name="${teamName}"`);
    return (result.values || []).length === 0;
  }

  async checkPlayer(teamName: string, playerName: string) {
    let result = await this.db.query(`SELECT * FROM players WHERE Name="${playerName}" AND Team="${teamName}";`);
    return (result.values || []).length === 0;
  }

  async addLeague(leagueName: string) {
    const result = await this.db.query(`INSERT INTO leagues (Name, Created) VALUES ("${leagueName}", 1)`);
    return result;
  }

  async addTeam(league: string, name: string, w: number, d: number, l: number, gf: number, ga: number) {
    const matches = w + d + l;
    const gd = gf - ga;
    const pts = w * 3 + d;
    const query = `INSERT INTO teams (Name, Matches, Win, Draw, Loss, GF, GA, GD, Pts, League) VALUES ("${name}", ${matches}, ${w}, ${d}, ${l}, ${gf}, ${ga}, ${gd}, ${pts}, "${league}");`;
    console.log(query);
    await this.db.query(query);
  }

  async addPlayer(team: string, name: string, n: string, age: number, m: number, s: number, min: number, g: number, a: number, p: string) {
    const query = `INSERT INTO players (Name, Nation, Age, Matches, Starts, Minutes, Goals, Assists, Position, Team) VALUES 
    ("${name}","${n}","${age}","${m}","${s}","${min}","${g}","${a}","${p}","${team}");`
    console.log(query);
    await this.db.query(query);
    console.log('end of add player');
  }

  async updateTeam(originalName: string, name: string, w: number, d: number, l: number, gf: number, ga: number) {
    const matches = w + d + l;
    const gd = gf - ga;
    const pts = w * 3 + d;

    console.log(originalName, name);

    //let team = await this.db.query(`SELECT * FROM teams WHERE Name="${originalName}"`);
    //console.log(team.values);
    const query = `UPDATE teams SET Name="${name}", Win="${w}", Draw="${d}", Loss="${l}", Matches="${matches}", GF="${gf}", GA="${ga}", GD="${gd}", Pts="${pts}" WHERE Name="${originalName}";`
    let result = await this.db.query(query);
    //console.log(query);
    //team = await this.db.query(`SELECT * FROM teams WHERE Name="${originalName}"`);
    //console.log(team.values);

    result = await this.db.query(`UPDATE players SET Team="${name}" WHERE Team="${originalName}";`);
    console.log(result);
    console.log('end of updateTeam()');
  }

  async updatePlayer(team: string, originalName: string, name: string, n: string, age: number, m: number, s: number, min: number, g: number, a: number, p: string) {
    console.log(originalName, name);
    const query = `UPDATE players SET 
    Name="${name}", Nation="${n}", Age="${age}", Matches="${m}",
    Starts="${s}", Minutes="${min}", Goals="${g}", Assists="${a}", Position="${p}"
    WHERE Name="${originalName}" AND Team="${team}";`
    await this.db.query(query);
    console.log('end of updatePlayer()');
  }

  async deleteLeague(leagueName: string) {
    let teams = await this.db.query(`SELECT * FROM teams WHERE League="${leagueName}"`);
    for (let team of (teams.values || [])) {
      await this.db.query(`DELETE FROM players WHERE Team="${team.Name}"`);
      //console.log(`DELETE FROM players WHERE Team="${team.Name}"`);
    }
    await this.db.query(`DELETE FROM teams WHERE League="${leagueName}"`);
    await this.db.query(`DELETE FROM leagues WHERE Name="${leagueName}"`);
  }

  async deleteTeam(teamName: string) {
    console.log('deleting team #2: ' + teamName);
    await this.db.query(`DELETE FROM players WHERE Team="${teamName}"`);
    await this.db.query(`DELETE FROM teams WHERE Name="${teamName}"`);
    console.log('deleted team with name: ' + teamName);
  }

  async deletePlayer(playerName: string, teamName: string) {
    await this.db.query(`DELETE FROM players WHERE Team="${teamName}" AND Name="${playerName}";`);
    console.log('deleted player: ' + playerName + ' from team: ' + teamName);
    await this.loadTop();
  }

  getPlayers() {
    return this.players;
  }
  getSinglePlayer() {
    return this.player;
  }
  getPlayersFromTeam(team: string) {
    return this.dbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const query = `SELECT * FROM players WHERE Team="${team}"`;
          return from(this.db.query(query));
        }
      })
    )
  }
  getPlayersGoals() {
    return this.playersGoals;
  }
  getPlayersAssists() {
    return this.playersAssists;
  }

  getTeams() {
    return this.teams;
  }
  getSingleTeam() {
    return this.team;
  }
  getTeamsBr() {
    return this.teamsBr;
  }
  getTeamsPL() {
    return this.teamsPL;
  }
  getArrayOfTeams() {
    return this.arrayOfTeams;
  }

  getLeagues() {
    return this.leagues;
  }
  getCreatedLeagues() {
    return this.createdLeagues;
  }

  getTopPlayer() {
    return this.topPlayer;
  }
  getTopPlayerTeam(){
    return this.topPlayerTeam;
  }
  getTopTeam() {
    return this.topTeam;
  }
  getTopLeague() {
    return this.topLeague;
  }
}
