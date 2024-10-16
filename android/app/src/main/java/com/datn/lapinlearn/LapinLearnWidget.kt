package com.datn.lapinlearn

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONException
import org.json.JSONObject

class LapinLearnWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // There may be multiple widgets active, so update all of them
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    try {
        val sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE)
        val appString = sharedPref.getString("appData", "{\"text\":'...'}")
        val appData = JSONObject(appString.toString())
        val views = RemoteViews(context.packageName, R.layout.lapin_learn_widget)


        if(appData.getString("text") == "0") {
            views.setInt(R.id.appwidgetContainer, "setBackgroundResource", R.drawable.app_widget_zero_streak_background)
            views.setTextViewText(R.id.encourageText, context.getString(R.string.app_widget_practice_more))
        } else {
            views.setInt(R.id.appwidgetContainer, "setBackgroundResource", R.drawable.app_widget_background)
            views.setTextViewText(R.id.encourageText, context.getString(R.string.app_widget_encouragement))
        }

        val intent = Intent(context, MainActivity::class.java)
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        val pendingIntent = PendingIntent.getActivity(context, 0, intent,
            PendingIntent.FLAG_IMMUTABLE)

        views.setOnClickPendingIntent(R.id.appwidgetContainer, pendingIntent)
        views.setTextViewText(R.id.appwidgetText, appData.getString("text"))
        appWidgetManager.updateAppWidget(appWidgetId, views)
    } catch (e: JSONException) {
        e.printStackTrace()
    }
}