import React, { useState, useEffect } from "react";
import "./App.css";
import { format, subDays } from "date-fns";

const checklistItemsPerUser = {
  Aheli: [
    "Left Hand Morning", "30 Minutes Reading", "4 Hydroflasks Water",
    "1 Hour MCAT", "Cooked Meal", "Workout", "Outdoor Activity", "Daily News", "Leetcode - Self", "Leetcode - Group"
  ],
  Vishnu: [
    "Yoga", "Meditation", "No Sugar", "Journal", "10k Steps"
  ],
  Varun: [
    "Run 2 miles", "Stretch", "Cold Shower", "Read 15 pages"
  ]
};

const getTodayDateString = (offset = 0) => {
  return format(subDays(new Date(), offset), "EEEE, MMMM d");
};

const getInitialData = () => {
  const saved = localStorage.getItem("hard75-data");
  return saved ? JSON.parse(saved) : {};
};

const Hard75DuoApp = () => {
  const [data, setData] = useState(getInitialData);
  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [currentUser, setCurrentUser] = useState("Aheli");
  const [openUsers, setOpenUsers] = useState({
    Aheli: true,
    Vishnu: false,
    Varun: false
  });

  const currentDate = getTodayDateString(currentDayOffset);

  // Save data locally (can later replace this with Firebase)
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
    return checklistItemsPerUser[user].every(item => userDay[item]);
  };

  const getCompletedDaysCount = user => {
    return Object.entries(data).filter(([date]) => isDayComplete(user, date)).length;
  };

  const getTodayCompletionPercentage = user => {
    const userDay = data[currentDate]?.[user] || {};
    const completed = checklistItemsPerUser[user].filter(item => userDay[item]).length;
    return Math.round((completed / checklistItemsPerUser[user].length) * 100);
  };

  const users = ["Aheli", "Vishnu", "Varun"];

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
            {user}
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
              <h2>{user}</h2>
              <p className="completion-percentage">{getTodayCompletionPercentage(user)}%</p>
            </div>
            {openUsers[user] && (
              <div className="card-content">
                <ul className="checklist">
                  {checklistItemsPerUser[user].map(item => (
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
              <p>{user}</p>
              <p>{getCompletedDaysCount(user)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hard75DuoApp;
