import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  topPlayer = this.database.getTopPlayer();
  topPlayerTeam = this.database.getTopPlayerTeam();
  topTeam = this.database.getTopTeam();
  topLeague = this.database.getTopLeague();

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private database: DatabaseService,
    private platform: Platform,
    private loadingCtrl: LoadingController,
  ) {
    this.initializeApp();
  }

  ionViewDidEnter(){
    console.log('Hello, this is app.component');
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.database.initializePlugin();
      this.database.dbReady.subscribe(isReady => {
        if (isReady) {
          loading.dismiss();
          SplashScreen.hide();
          console.log('db is ready to init');
        }
      });
    });
  }

  home() {
    this.navCtrl.setDirection('root');
    this.router.navigate(['']);
    this.menuCtrl.toggle();
  }

  open(page: any) {
    console.log('trying to open');
    let path ="";
    switch(page){
      case 'newleague':
        path = 'new';
        break;
      case 'manageleagues':
        path = `${this.topLeague()[0].Name}`;
        break;
      case 'manageteams':
        path = `${this.topTeam()[0].League}/${this.topTeam()[0].Name}`;
        break;
      case 'manageplayers':
        path = `${this.topPlayerTeam()[0].League}/${this.topPlayer()[0].Team}/${this.topPlayer()[0].Name}`;
        break;
      default:
        break;
    }
      
    const encoded = encodeURIComponent(path);
    console.log(page, path, encoded);
    this.navCtrl.setDirection('root');
    //this.router.navigateByUrl(`/newLeague/${encoded}`);
    this.router.navigate([`${page}/${encoded}`]);
    this.menuCtrl.toggle();
    console.log('redirected');
  }
  openTeste(){
    console.log('open test');
    console.log(this.topPlayer());
    console.log(this.topTeam());
    console.log(this.topLeague());
  }
}
