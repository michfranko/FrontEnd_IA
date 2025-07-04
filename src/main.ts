import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

// Se eliminó la configuración base y la importación de appConfig
bootstrapApplication(App)
  .catch((err) => console.error(err));
