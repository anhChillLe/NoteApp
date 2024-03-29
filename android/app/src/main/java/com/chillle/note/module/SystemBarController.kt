package com.chillle.note.module

import android.graphics.Color
import android.os.Build
import android.util.Log
import android.view.Window
import androidx.annotation.ColorInt
import androidx.core.graphics.ColorUtils
import androidx.core.graphics.toColor
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import okhttp3.internal.toHexString

class SystemBarController(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scope by lazy { CoroutineScope(Dispatchers.Main + SupervisorJob()) }
    companion object {
        private fun String.toIntColor(): Int {
            return Color.parseColor(this)
        }

        val Int.isDark: Boolean
            get() {
                val isOverApi26 = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                return if (isOverApi26)
                    toColor().luminance() < 0.5F
                else
                    ColorUtils.calculateLuminance(this) < 0.5F
            }
    }

    override fun getName(): String {
        return "SystemBarController"
    }

    private val window: Window?
        get() {
            val activity = reactContext.currentActivity ?: return null
            return activity.window
        }
    private val wic: WindowInsetsControllerCompat?
        get() {
            return window?.let { WindowCompat.getInsetsController(it, it.decorView) }
        }


    @ReactMethod(isBlockingSynchronousMethod = false)
    fun setNavigationBarColor(strColor: String) {
        val color = strColor.toIntColor()
        setNavigationBarColor(color)
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun setStatusBarColor(strColor: String) {
        val color = strColor.toIntColor()
        setStatusBarColor(color)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getStatusBarColor(): String? {
        val intColor = window?.statusBarColor ?: return null
        return java.lang.String.format("#%06X", 0xFFFFFF and intColor)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getNavigationBarColor(): String? {
        val intColor = window?.navigationBarColor ?: return null
        return java.lang.String.format("#%06X", 0xFFFFFF and intColor)
    }

    private fun setNavigationBarColor(@ColorInt color: Int) {
        scope.launch {
            window?.navigationBarColor = color
            wic?.isAppearanceLightNavigationBars = !color.isDark
        }
    }

    private fun setStatusBarColor(@ColorInt color: Int) {
        scope.launch {
            window?.statusBarColor = color
            wic?.isAppearanceLightStatusBars = !color.isDark
        }
    }
}