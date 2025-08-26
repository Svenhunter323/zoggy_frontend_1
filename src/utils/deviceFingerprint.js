// Device fingerprinting utilities
export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Device fingerprint', 2, 2)
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    canvas: canvas.toDataURL(),
    webgl: getWebGLFingerprint(),
    plugins: Array.from(navigator.plugins).map(p => p.name).sort(),
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB,
    cpuClass: navigator.cpuClass,
    hardwareConcurrency: navigator.hardwareConcurrency
  }
  
  // Generate hash from fingerprint
  return hashCode(JSON.stringify(fingerprint))
}

const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return null
    
    return {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    }
  } catch (e) {
    return null
  }
}

const hashCode = (str) => {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

// Store device fingerprint in localStorage
export const storeDeviceFingerprint = () => {
  try {
    const fingerprint = generateDeviceFingerprint()
    localStorage.setItem('zoggy_device_fingerprint', fingerprint)
    return fingerprint
  } catch (e) {
    console.warn('Failed to store device fingerprint:', e)
    return null
  }
}

// Get stored device fingerprint
export const getStoredDeviceFingerprint = () => {
  try {
    return localStorage.getItem('zoggy_device_fingerprint')
  } catch (e) {
    return null
  }
}

// Check if device has been used for signup before
export const hasDeviceSignedUpBefore = () => {
  try {
    return localStorage.getItem('zoggy_signup_completed') === 'true'
  } catch (e) {
    return false
  }
}

// Mark device as having completed signup
export const markDeviceAsSignedUp = () => {
  try {
    localStorage.setItem('zoggy_signup_completed', 'true')
    localStorage.setItem('zoggy_signup_timestamp', Date.now().toString())
  } catch (e) {
    console.warn('Failed to mark device as signed up:', e)
  }
}
