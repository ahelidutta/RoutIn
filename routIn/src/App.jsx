import React, { useState, useEffect } from "react";
import "./App.css";
import { format, subDays } from "date-fns";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const checklistItems = [
  "Workout 1",
  "Workout 2",
  "Drink 1 Gallon Water",
  "Read 10 Pages",
  "Follow Diet",
  "Take Progress Photo"
];

const users = ["user1", "user2", "user3"];
const getTodayDateString = (offset = 0) =>
  format(subDays(new Date(), offset), "EEEE, MMMM d");

const Hard75DuoApp = () => {
  const [allUserData, setAllUserData] = useState({});
  const [loadedUsers, setLoadedUsers] = useState(new Set());
  const [currentUser, setCurrentUser] = useState("user1");
  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentDate = getTodayDateString(currentDayOffset);

  // Load all users' data once
  useEffect(() => {
    const fetchAll = async () => {
      const loadedData = {};
      const newLoaded = new Set();
      for (const user of users) {
        const snap = await getDoc(doc(db, "userData", user));
        loadedData[user] = snap.exists() ? snap.data() : {};
        newLoaded.add(user);
      }
      setAllUserData(loadedData);
      setLoadedUsers(newLoaded);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Save to Firestore only if this user's data has already been loaded
  useEffect(() => {
    if (!loadedUsers.has(currentUser)) return;
    const save = async () => {
      await setDoc(doc(db, "userData", currentUser), allUserData[currentUser] || {});
    };
    save();
  }, [allUserData[currentUser]]); // Only watch current user's data

  const toggleItem = (user, date, item) => {
    if (user !== currentUser) return;

    const userData = allUserData[user] || {};
    const day = userData[date] || {};
    const updatedDay = { ...day, [item]: !day[item] };

    setAllUserData(prev => ({
      ...prev,
      [user]: {
        ...userData,
        [date]: updatedDay
      }
    }));
  };

  const isDayComplete = (user, date) => {
    const day = allUserData[user]?.[date] || {};
    return checklistItems.every(item => day[item]);
  };

  const getCompletedDaysCount = (user) => {
    const userData = allUserData[user] || {};
    return Object.entries(userData).filter(([_, day]) =>
      checklistItems.every(item => day[item])
    ).length;
  };

  const getTodayCompletionPercentage = (user) => {
    const day = allUserData[user]?.[currentDate] || {};
    const completed = checklistItems.filter(item => day[item]).length;
    return Math.round((completed / checklistItems.length) * 100);
  };

  if (loading) return <p>Loading...</p>;

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
            {user.replace("user", "User ")}
          </button>
        ))}
      </div>

      <div className="nav-controls">
        <button className="btn" onClick={() => setCurrentDayOffset(o => o + 1)}>← Previous</button>
        <h3 className="date-label">{currentDate}</h3>
        <button className="btn" onClick={() => setCurrentDayOffset(o => Math.max(o - 1, 0))}>Next →</button>
      </div>

      <div className="card-stack">
        {users.map(user => (
          <div key={user} className={`card ${user === currentUser ? "active-user" : ""}`}>
            <div className="card-header dropdown">
              <h2>{user.replace("user", "User ")}</h2>
              <p className="completion-percentage">{getTodayCompletionPercentage(user)}%</p>
            </div>
            <div className="card-content">
              <ul className="checklist">
                {checklistItems.map(item => (
                  <li key={item}>
                    <label>
                      <input
                        type="checkbox"
                        disabled={user !== currentUser}
                        checked={allUserData[user]?.[currentDate]?.[item] || false}
                        onChange={() => toggleItem(user, currentDate, item)}
                      />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-section">
        <h3>Streak</h3>
        <div className="progress-stats">
          {users.map(user => (
            <div key={user}>
              <p>{user.replace("user", "User ")}</p>
              <p>{getCompletedDaysCount(user)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hard75DuoApp;