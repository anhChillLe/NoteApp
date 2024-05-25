interface SystemBar {
  setNavigationBarColor: (color: string) => Promise<void>
  animatedNavigationBarColor: (color: string, duration: number) => Promise<void>
  animatedStatusBarColor: (color: string, duration: number) => Promise<void>
  animatedSystemBarColor: (color: string, duration: number) => Promise<void>
  getNavigationBarColor: () => string | null
  setStatusBarColor: (color: string) => Promise<void>
  setSystemBarColor: (color: string) => Promise<void>
  setIsAppearanceLightStatusBars: (isLight: boolean) => Promise<void>
  setIsAppearanceLightNavigationBars: (isLight: boolean) => Promise<void>
  getStatusBarColor: () => string | null
  hideStatusBar: () => void
  showStatusBar: () => void
  hideNavigationBar: () => void
  showNavigationBar: () => void
  hideSystemBar: () => void
  showSystemBar: () => void
}
