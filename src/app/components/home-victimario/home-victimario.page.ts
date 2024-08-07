import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { LoadingController, AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NotificacionService } from 'src/app/services/notificacion.service';


@Component({
  selector: 'app-home-victimario',
  templateUrl: './home-victimario.page.html',
  styleUrls: ['./home-victimario.page.scss'],
})
export class HomeVictimarioPage implements OnInit {

  loaderToShow: any;
  pruebasDeVida: PruebaDeVida[] = [];
  hayPruebasDeVida = true;
  fotoSacada: any;
  pruebaSeleccionada: PruebaDeVida;
  notificationCount: number = 0;

  //Back button
  subscribe: any;

  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private storage: Storage,
    private notifactionService: NotificacionService,
    private alertController: AlertController
  ) { this.pruebaSeleccionada = new PruebaDeVida(); }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getNotificationCount();
  }

  getNotificationCount() {
    this.storage.get('persona').then(async (email) => {
      this.notifactionService.getCantidadNoVistas(email).subscribe(res => {
        this.notificationCount = res as number
      });
    })
  }

  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Cargando solicitudes de prueba de vida'
    }).then(async (res) => {
      await res.present();
    });
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar la sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            // Realizar el cierre de sesión
            localStorage.setItem('emailUsuario', '');
            this.storage.set('usuario', new Usuario());
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  openNotifications() {
    this.router.navigate(['/notificaciones']);
  }

}
