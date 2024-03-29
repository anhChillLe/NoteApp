package com.chillle.note.module

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class AppPackage : ReactPackage {
    override fun createNativeModules(reactApplicationContext: ReactApplicationContext): MutableList<NativeModule> {
        val systemBarControllerModule = SystemBarController(reactApplicationContext)
        return mutableListOf(systemBarControllerModule)
    }

    override fun createViewManagers(reactApplicationContext: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> {
        return mutableListOf()
    }
}