// Hard75DuoApp.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";

const checklistItems = [
  "Workout 1",
  "Workout 2",
  "Drink 1 Gallon Water",
  "Read 10 Pages",
  "Follow Diet",
  "Take Progress Photo"
];

const getTodayDateString = (offset = 0) => {
  return format(subDays(new Date(), offset), "yyyy-MM-dd");
};

const getInitialData = () => {
  const saved = localStorage.getItem("hard75-data");
  return saved ? JSON.parse(saved) : {};
};

const Hard75DuoApp = () => {
  const [data, setData] = useState(getInitialData);
  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [currentUser, setCurrentUser] = useState("user1");

  const currentDate = getTodayDateString(currentDayOffset);

  useEffect(() => {
    localStorage.setItem("hard75-data", JSON.stringify(data));
  }, [data]);

  const toggleItem = (user, date, item) => {
    if (user !== currentUser) return;
    const userDay = data[date]?.[user] || {};
    const updatedUserDay = {
      ...userDay,
      [item]: !userDay[item]
    };
    const updatedDay = {
      ...data[date],
      [user]: updatedUserDay
    };
    setData({
      ...data,
      [date]: updatedDay
    });
  };

  const isDayComplete = (user, date) => {
    const userDay = data[date]?.[user] || {};
    return checklistItems.every(item => userDay[item]);
  };

  const getCompletedDaysCount = user => {
    return Object.entries(data).filter(([date, val]) => isDayComplete(user, date)).length;
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">75 Hard Duo Tracker</h1>
      <div className="flex justify-center gap-4">
        <Button onClick={() => setCurrentUser("user1")} variant={currentUser === "user1" ? "default" : "outline"}>User 1</Button>
        <Button onClick={() => setCurrentUser("user2")} variant={currentUser === "user2" ? "default" : "outline"}>User 2</Button>
      </div>
      <div className="flex justify-between">
        <Button onClick={() => setCurrentDayOffset(offset => offset + 1)}>← Previous</Button>
        <p className="text-center">Date: {currentDate}</p>
        <Button onClick={() => setCurrentDayOffset(offset => Math.max(offset - 1, 0))}>Next →</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["user1", "user2"].map(user => (
          <Card key={user} className={user === currentUser ? "border-2 border-green-500" : "border"}>
            <CardContent>
              <h2 className="font-semibold mb-2">{user === "user1" ? "User 1" : "User 2"}</h2>
              <ul className="space-y-2">
                {checklistItems.map(item => (
                  <li key={item}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={user !== currentUser}
                        checked={data[currentDate]?.[user]?.[item] || false}
                        onChange={() => toggleItem(user, currentDate, item)}
                      />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold text-center">Progress</h3>
        <div className="flex justify-around">
          {["user1", "user2"].map(user => (
            <div key={user} className="text-center">
              <p>{user === "user1" ? "User 1" : "User 2"}</p>
              <p>⭐ {getCompletedDaysCount(user)} days complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hard75DuoApp;
