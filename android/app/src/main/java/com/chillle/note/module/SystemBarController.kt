package com.chillle.note.module

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.graphics.Color
import android.os.Build
import android.util.Log
import android.view.Window
import android.view.WindowManager
import android.view.animation.LinearInterpolator
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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SystemBarController(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scope by lazy { CoroutineScope(Dispatchers.Main + SupervisorJob()) }

    companion object {
        private fun String.toIntColor(): Int {
            return Color.parseColor(this)
        }

        private fun Int.toHexColor(): String {
            return String.format("#%06X", 0xFFFFFF and this)
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
        return window.navigationBarColor.toHexColor()
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun setStatusBarColor(strColor: String) {
        val color = strColor.toIntColor()
        setStatusBarColor(color)
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun setSystemBarColor(strColor: String) {
        val color = strColor.toIntColor()
        setStatusBarColor(color)
        setNavigationBarColor(color)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getStatusBarColor(): String {
        return window.statusBarColor.toHexColor()
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun animatedNavigationBarColor(color: String, duration: Int = 200) {
        val startColor = getNavigationBarColor().toIntColor()
        val endColor = color.toIntColor()
        val colorAnimator = ValueAnimator.ofArgb(startColor, endColor)
        colorAnimator.duration = duration.toLong()
        colorAnimator.interpolator = LinearInterpolator()
        colorAnimator.addUpdateListener {
            window.navigationBarColor = it.animatedValue as Int
        }
        scope.launch {
            delay(duration.toLong())
            wic.isAppearanceLightNavigationBars = !endColor.isDark
        }
        colorAnimator.start()
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun animatedStatusBarColor(color: String, duration: Int = 200) {
        val startColor = getNavigationBarColor().toIntColor()
        val endColor = color.toIntColor()
        val colorAnimator = ValueAnimator.ofArgb(startColor, endColor)
        colorAnimator.duration = duration.toLong()
        colorAnimator.addUpdateListener {
            window.statusBarColor = it.animatedValue as Int
        }
        scope.launch {
            delay(duration.toLong())
            wic.isAppearanceLightStatusBars = !endColor.isDark
        }
        colorAnimator.start()
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun animatedSystemBarColor(color: String, duration: Int = 200) {
        animatedStatusBarColor(color, duration)
        animatedNavigationBarColor(color, duration)
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

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun setIsAppearanceLightStatusBars(isLight: Boolean){
        scope.launch {
            wic.isAppearanceLightStatusBars = isLight
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun setIsAppearanceLightNavigationBars(isLight: Boolean){
        scope.launch {
            wic.isAppearanceLightNavigationBars = isLight
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