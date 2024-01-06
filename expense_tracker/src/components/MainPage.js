import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupId, setNewGroupId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [users, setusers] = useState([]);
  const [showUser, setShowUser] = useState(false);

  const fetchUserGroups = () => {
    fetch('/GetAllGroups')
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
  }

  const handleNewUser = async () => {
    setShowUser(false);
    try {
      const newUser = await fetch('/AddUser', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          UserId:newUserId,
          UserName:newUserName
        }),
      });

      if (!newUser.ok) {
        throw new Error("Failed to send newUser details to backend");
      }

      const data = await newUser.json();

      setNewUserId('');
      setNewUserName('');
    } catch (error) {
      console.error('Error adding user', error.message);
    }
  }

  const fetchUsers = () => {
    fetch('/GetAllUsers')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setusers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const form_submit = async () => {
    setShowForm(false);
    try {
      const response = await fetch('/AddGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          GroupName:newGroupName,
          GroupId:newGroupId,
          UserIds:selectedUserIds
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send group details to backend");
      }

      const data = await response.json();

      setSelectedUserIds([]);
      setNewGroupId('');
      setNewGroupName('');
      fetchUserGroups();
    } catch (error) {
      console.error('Error adding Group:', error.message);
    }
  };

  useEffect(() => {
    fetchUserGroups();
    fetchUsers();
  }, [users, userGroups]);

  const handleGroupSelection = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div>
      <div>
        <h1>Main Page</h1>
        <div>
          <div>
            <button onClick={() => { setShowForm(true) }}>Create New Group</button>
            {showForm && (
              <form>
                <label>
                  Group Name:
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder='Enter new Group Name'
                  />
                </label>
                <label>
                  Group ID:
                  <input
                    type="text"
                    value={newGroupId}
                    onChange={(e) => setNewGroupId(e.target.value)}
                    placeholder='Enter new Group Id'
                  />
                </label>
                <h2>User List</h2>
                <ul>
                  {users.map((user) => (
                    <li key={user.Id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.Id)}
                          onChange={() =>
                            setSelectedUserIds((prevSelectedUsers) =>
                              prevSelectedUsers.includes(user.Id)
                                ? prevSelectedUsers.filter((id) => id !== user.Id)
                                : [...prevSelectedUsers, user.Id]
                            )
                          }
                        />
                        {user.Name}
                      </label>
                    </li>
                  ))}
                </ul>
                <button onClick={form_submit}>Add Group</button>
              </form>
            )}
          </div>
          <div>
            <button onClick={() => { setShowUser(true) }}>Add new User</button>
            {showUser && (
              <form className='input-userForm'>
                <label>
                  User Name:
                  <input
                    type='text'
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder='Enter new User Name'
                    className='input-userName' />
                </label>
                <label>
                  User Id:
                  <input
                    type='text'
                    value={newUserId}
                    onChange={(e) => { setNewUserId(e.target.value) }}
                    placeholder='Enter new User Id'
                    className='input-userId' />
                </label>
                <button onClick={handleNewUser}>Add User</button>
              </form>
            )}
          </div>
          <h2>User Groups</h2>
          <ul>
            {userGroups.map((group) => (
              <li key={group.Id}>
                <Link to={`/groups/${selectedGroupId}`} onClick={() => handleGroupSelection(group.Id)}>
                  {group.Name}
                </Link>
                <p>{group.Id} - {group.UserOwed.Id}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}