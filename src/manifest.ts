import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: '__MSG_app_name__',
  description: '__MSG_app_desc__',
  version: '0.1.0',
  default_locale: 'en',
  action: {
    default_popup: 'src/popup/index.html'
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module'
  },
  permissions: ['storage', 'alarms', 'notifications', 'geolocation'],
  // TODO: restrict host permissions to required domains
  host_permissions: ['https://*/', 'http://*/']
});
