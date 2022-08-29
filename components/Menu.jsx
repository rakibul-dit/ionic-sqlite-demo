import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { homeOutline, shareSocialOutline, informationCircleOutline } from 'ionicons/icons';

const menus = [
  {
    title: 'হোম',
    icon: homeOutline,
    url: '/',
  },
  {
    title: 'শেয়ার করুন',
    icon: shareSocialOutline,
    url: '/',
  },
  {
    title: 'সম্বন্ধে',
    icon: informationCircleOutline,
    url: '/',
    isHr: true,
  },
];

const Menu = () => {
  // useEffect(() => {
  //   console.log(window.matchMedia('(prefers-color-scheme: dark)').matches);
  // }, []);

  return (
    <IonMenu side="start" contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="menu">
        <IonList>
          {menus.map((m, k) =>
            m.isHr ? (
              <div key={k}>
                <hr />
                <IonMenuToggle autoHide={false} key={k}>
                  <IonItem routerLink={m.url} routerDirection="forward" detail={false} lines="none">
                    <IonIcon icon={m.icon} slot="start" />
                    <IonLabel>{m.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </div>
            ) : (
              <IonMenuToggle autoHide={false} key={k}>
                <IonItem routerLink={m.url} routerDirection="forward" detail={false} lines="none">
                  <IonIcon icon={m.icon} slot="start" />
                  <IonLabel>{m.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
