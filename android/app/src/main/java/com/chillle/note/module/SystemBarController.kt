package com.chillle.note.module

import android.graphics.Color
import android.os.Build
import android.view.Window
import androidx.annotation.ColorInt
import androidx.core.graphics.ColorUtils
import androidx.core.graphics.toColor
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.chillle.note.module.SystemBarController.Companion.isDark
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

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

    private val window: Window
        get() {
            val activity =
                reactContext.currentActivity ?: throw Exception("Current activity not found")
            return activity.window
        }
    private val wic: WindowInsetsControllerCompat
        get() = WindowCompat.getInsetsController(window, window.decorView)


    @ReactMethod(isBlockingSynchronousMethod = false)
    fun setNavigationBarColor(strColor: String) {
        val color = strColor.toIntColor()
        setNavigationBarColor(color)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getNavigationBarColor(): String {
        val intColor = window.navigationBarColor
        return String.format("#%06X", 0xFFFFFF and intColor)
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun setStatusBarColor(strColor: String) {
        val color = strColor.toIntColor()
        setStatusBarColor(color)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getStatusBarColor(): String {
        val intColor = window.statusBarColor
        return String.format("#%06X", 0xFFFFFF and intColor)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hideStatusBar() {
        scope.launch {
            wic.hide(WindowInsetsCompat.Type.statusBars())
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun showStatusBar() {
        scope.launch {
            wic.show(WindowInsetsCompat.Type.statusBars())
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hideNavigationBar() {
        scope.launch {
            wic.hide(WindowInsetsCompat.Type.navigationBars())
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun showNavigationBar() {
        scope.launch {
            wic.show(WindowInsetsCompat.Type.navigationBars())
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun showSystemBar() {
        scope.launch {
            wic.show(WindowInsetsCompat.Type.systemBars())
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hideSystemBar() {
        scope.launch {
            wic.hide(WindowInsetsCompat.Type.systemBars())
        }
    }

    private fun setStatusBarColor(@ColorInt color: Int) {
        scope.launch {
            window.statusBarColor = color
            wic.isAppearanceLightStatusBars = !color.isDark

        }
    }

    private fun setNavigationBarColor(@ColorInt color: Int) {
        scope.launch {
            window.navigationBarColor = color
            wic.isAppearanceLightNavigationBars = !color.isDark
        }
    }


}