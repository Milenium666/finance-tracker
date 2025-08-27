import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom,  } from '@angular/core';
import { TuiRootModule } from "@taiga-ui/core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(TuiRootModule),
  ],
};

