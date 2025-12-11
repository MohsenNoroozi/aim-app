export const buildMeta = () => ({
  deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  userAgent: navigator.userAgent,
  browserLanguage: navigator.language,
  languages: navigator.languages,
  cookieEnabled: navigator.cookieEnabled,
  doNotTrack: navigator.doNotTrack,
  online: navigator.onLine,

  screen: {
    width: window.screen.width,
    height: window.screen.height,
  },

  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
  },

  hardware: {
    memory: navigator?.['deviceMemory'] ?? null,
    cpuCores: navigator.hardwareConcurrency ?? null,
  },

  timezone: {
    name: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: new Date().getTimezoneOffset(),
  },
})
