import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.edu.corhuila.movierater',
  appName: 'Movie Rater',
  webDir: 'dist',
  server: { androidScheme: 'https', cleartext: true },
};

export default config;
