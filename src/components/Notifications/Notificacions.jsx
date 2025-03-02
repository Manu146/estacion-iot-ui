//import React from 'react'
import NotificationCriticalCard from "./NotificationCriticalCard";
import NotificationInfoCard from "./NotificationInfoCard";
import { Bell } from "lucide-preact";

export default function Notifications({ notifications, dismissFn }) {
  const criticalNotifications = notifications.critical;
  const qtyCriticalNotifications = criticalNotifications.length;
  const infoNotifications = notifications.info;
  const qtyInfoNotifications = infoNotifications.length;
  const qtyNotifications = qtyCriticalNotifications + qtyInfoNotifications;
  return (
    <div className="w-full flex flex-col mt-6">
      <div className="bg-gray-100 text-gray-400 dark:bg-gray-700 px-4 py-3 flex items-center gap-4 rounded-lg">
        <div className="text-gray-500 dark:text-gray-400 mt-1">
          <Bell size={16} />
        </div>
        <div className="">
          {qtyCriticalNotifications > 0 && (
            <span class="bg-red-600 text-red-100 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:text-red-200">
              {qtyCriticalNotifications} Críticas
            </span>
          )}
          {qtyInfoNotifications > 0 && (
            <span class="bg-blue-600 text-blue-200 text-xs font-medium  px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
              {qtyInfoNotifications} Info
            </span>
          )}
        </div>
        <span className="text-sm font-semibold">
          {qtyNotifications} Alarmas
        </span>
      </div>
      {qtyCriticalNotifications > 0 &&
        criticalNotifications.map((ca) => (
          <NotificationCriticalCard notification={ca} dismissFn={dismissFn} />
        ))}
      {qtyInfoNotifications > 0 &&
        infoNotifications.map((ia) => (
          <NotificationInfoCard notification={ia} dismissFn={dismissFn} />
        ))}
    </div>
  );
}
