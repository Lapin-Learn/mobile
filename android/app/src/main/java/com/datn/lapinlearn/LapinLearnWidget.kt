package com.datn.lapinlearn

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import org.json.JSONException
import org.json.JSONObject


class LapinLearnWidget : AppWidgetProvider() {
    val REFRESH_ACTION: String = "com.datn.lapinlearn.REFRESH_ACTION"

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
        val appString = sharedPref.getString("appData", "{\"text\":'no data'}")
        val appData = JSONObject(appString.toString())
        val views = RemoteViews(context.packageName, R.layout.lapin_learn_widget)

        if(appData.getString("text") == "0") {
            views.setInt(R.id.appwidgetContainer, "setBackgroundResource", R.drawable.app_widget_zero_streak_background)
        } else {
            views.setInt(R.id.appwidgetContainer, "setBackgroundResource", R.drawable.app_widget_background)
        }

        val intent = Intent(context, MainActivity::class.java)
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        val pendingIntent = PendingIntent.getActivity(context, 0, intent,
            PendingIntent.FLAG_IMMUTABLE)

        views.setOnClickPendingIntent(R.id.appwidgetContainer, pendingIntent)
        views.setTextViewText(R.id.appwidgetText, appData.getString("text"))
        appWidgetManager.updateAppWidget(appWidgetId, views)

//        val rv = RemoteViews(context.packageName, R.layout.widget_layout)
//
//        val intentServiceCall = Intent(
//            context,
//            WidgetService::class.java
//        )
//        intentServiceCall.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetIds.get(i))
//
//
//        //Refresh
//        val refreshIntent = Intent(context, LapinLearnWidget::class.java)
//        refreshIntent.setAction(LapinLearnWidget.REFRESH_ACTION)
//        refreshIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds)
//        intentServiceCall.setData(Uri.parse(intentServiceCall.toUri(Intent.URI_INTENT_SCHEME)))
//        val pendingIntent =
//            PendingIntent.getBroadcast(context, 0, refreshIntent, PendingIntent.FLAG_UPDATE_CURRENT)
//        rv.setOnClickPendingIntent(R.id.ivRefreshWidget, pendingIntent)

    } catch (e: JSONException) {
        e.printStackTrace()
    }
}