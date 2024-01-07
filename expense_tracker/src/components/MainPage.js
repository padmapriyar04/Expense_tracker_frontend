import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../constants";

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [users, setusers] = useState([]);
  const [showUser, setShowUser] = useState(false);

  const fetchUserGroups = () => {
    fetch(API_URL + "/GetAllGroups")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserGroups(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleNewUser = async () => {
    setShowUser(false);
    try {
      const newUser = await fetch(API_URL + "/AddUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          UserId: newUserId, // user id not needed
          name: newUserName,
        }),
      });

      if (!newUser.ok) {
        throw new Error("Failed to send newUser details to backend");
      }

      const data = await newUser.json();

      setNewUserId("");
      setNewUserName("");
    } catch (error) {
      console.error("Error adding user", error.message);
    }
  };

  const fetchUsers = () => {
    fetch(API_URL + "/GetAllUsers")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setusers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const form_submit = async () => {
    setShowForm(false);
    try {
      const response = await fetch("/AddGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName: newGroupName,
          GroupId: newGroupId, // group id not needed (backed auto inderts it)
          userId: selectedUserIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send group details to backend");
      }

      const data = await response.json();

      setSelectedUserIds([]);
      setNewGroupId("");
      setNewGroupName("");
      fetchUserGroups();
    } catch (error) {
      console.error("Error adding Group:", error.message);
    }
  };

  useEffect(() => {
    fetchUserGroups();
    fetchUsers();
  }, []);

  const handleGroupSelection = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <h1>Main Page</h1>
        <div>
          <div>
            <button
              onClick={() => {
                setShowForm(true);
              }}
            >
              Create New Group
            </button>
            {showForm && (
              <form className="input-form">
                <label>Group Name:</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter new Group Name"
                  className="text"
                />

                <label>Group ID:</label>
                <input
                  type="text"
                  value={newGroupId}
                  onChange={(e) => setNewGroupId(e.target.value)}
                  placeholder="Enter new Group Id"
                  className="text"
                />

                <h2>User List</h2>
                <ul>
                  {users.map((user) => (
                    <li key={user.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() =>
                            setSelectedUserIds((prevSelectedUsers) =>
                              prevSelectedUsers.includes(user.id)
                                ? prevSelectedUsers.filter(
                                    (id) => id !== user.id
                                  )
                                : [...prevSelectedUsers, user.id]
                            )
                          }
                        />
                        {user.name}
                      </label>
                    </li>
                  ))}
                </ul>
                <button onClick={form_submit}>Add Group</button>
              </form>
            )}
          </div>
          <div>
            <button
              onClick={() => {
                setShowUser(true);
              }}
              style={{ marginTop: "10px" }}
            >
              Add new User
            </button>
            {showUser && (
              <form className="input-form">
                <label>User Name:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter new User Name"
                  className="text"
                />

                <label>User Id:</label>
                <input
                  type="text"
                  value={newUserId}
                  onChange={(e) => {
                    setNewUserId(e.target.value);
                  }}
                  placeholder="Enter new User Id"
                  className="text"
                />

                <button onClick={handleNewUser}>Add User</button>
              </form>
            )}
          </div>
          <h2>User Groups</h2>
          <ul>
            {userGroups.map((group) => (
              <li key={group.Id}>
                <Link
                  to={`/groups/${selectedGroupId}`}
                  onClick={() => handleGroupSelection(group.Id)}
                >
                  {group.Name}
                </Link>
                <p>
                  {group.Id} - {group.UserOwed.Id}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
