package com.androidsystembar

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager


class AndroidSystemBarPackage : ReactPackage {
  override fun createNativeModules(reactApplicationContext: ReactApplicationContext): MutableList<NativeModule> {
      val systemBarControllerModule = AndroidSystemBarModule(reactApplicationContext)
      return mutableListOf(systemBarControllerModule)
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
