// Hard75DuoApp.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
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
  return format(subDays(new Date(), offset), "EEEE, MMMM d"); // Format: Monday, June 15
};

const getInitialData = () => {
  const saved = localStorage.getItem("hard75-data");
  return saved ? JSON.parse(saved) : {};
};

const Hard75DuoApp = () => {
  const [data, setData] = useState(getInitialData);
  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [currentUser, setCurrentUser] = useState("user1");
  const [openUsers, setOpenUsers] = useState({ user1: true, user2: false, user3: false });

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

  const getTodayCompletionPercentage = user => {
    const userDay = data[currentDate]?.[user] || {};
    const completed = checklistItems.filter(item => userDay[item]).length;
    return Math.round((completed / checklistItems.length) * 100);
  };

  const users = ["user1", "user2", "user3"];

  const toggleDropdown = user => {
    setOpenUsers(prev => ({ ...prev, [user]: !prev[user] }));
  };

  return (
    <div className="app-container">
    <div className="app-title-wrapper">
      <div className="title-line" />
      <h1 className="main-title">RoutIN</h1>
      <div className="title-line" />
    </div>

      <div className="user-toggle">
        {users.map(user => (
          <button
            key={user}
            className={currentUser === user ? "btn active" : "btn"}
            onClick={() => setCurrentUser(user)}
          >
            {user.charAt(0).toUpperCase() + user.slice(1).replace("user", "User ")}
          </button>
        ))}
      </div>
      <div className="nav-controls">
        <button className="btn" onClick={() => setCurrentDayOffset(offset => offset + 1)}>← Previous</button>
        <h3 className="date-label">{currentDate}</h3>
        <button className="btn" onClick={() => setCurrentDayOffset(offset => Math.max(offset - 1, 0))}>Next →</button>
      </div>
      <div className="card-stack">
        {users.map(user => (
          <div key={user} className={`card ${user === currentUser ? "active-user" : ""}`}>
            <div className="card-header dropdown" onClick={() => toggleDropdown(user)}>
              <h2>{user.charAt(0).toUpperCase() + user.slice(1).replace("user", "User ")}</h2>
              <p className="completion-percentage">{getTodayCompletionPercentage(user)}%</p>
            </div>
            {openUsers[user] && (
              <div className="card-content">
                <ul className="checklist">
                  {checklistItems.map(item => (
                    <li key={item}>
                      <label>
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
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="progress-section">
        <h3>Streak</h3>
        <div className="progress-stats">
          {users.map(user => (
            <div key={user}>
              <p>{user.charAt(0).toUpperCase() + user.slice(1).replace("user", "User ")}</p>
              <p> {getCompletedDaysCount(user)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hard75DuoApp;
