import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';

// Se eliminó la configuración base y la importación de appConfig
bootstrapApplication(App, {providers: [
  provideHttpClient(),
]})
  .catch((err) => console.error(err));
