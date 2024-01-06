import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EqualShareSection from "./EqualShareSection";
import PercentageShareSection from "./PercentageShareSection";
import "../styles/GroupPage.css";

export default function GroupPage() {
  const { groupId } = useParams();
  const [GroupUsers, setGroupUsers] = useState([]);
  const [showUser, setShowUser] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [TransactionType, setTransactionType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [ShareType, setShareType] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userPercentageShares, setUserPercentageShares] = useState([]);
  const [AllTransactions, setAllTransactions] = useState([]);
  const [TransactionDetails, setTransactionDetails] = useState({});
  const [showTransaction, setshowTransaction] = useState(false);
  const [TransactionName, setTransactionName] = useState("");
  const [TotalAmount, setTotalAmount] = useState(0);

  const handleEqualshare = async () => {
    setshowTransaction(false);

    try {
      const equalShare = Math.round(TotalAmount / selectedUsers.length);
      const response = await fetch(`/AddTranscationsplitequally/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Category: TransactionType,
          Name: TransactionName,
          UserIds: selectedUsers,
          Share: equalShare,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send new user details to the backend");
      }

      const data = await response.json();

      setSelectedUsers([]);
      fetchGroupUsers();
    } catch (error) {
      console.error(
        "Error adding users in Group split equally:",
        error.message
      );
    }
  };

  useEffect(() => {
    console.log(showDropdown);
  }, [showDropdown]);

  const handleAddUser = async () => {
    setShowUser(false);
    try {
      const response = await fetch(`/AddUserToGroup/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: selectedUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send new user details to backend");
      }

      const data = await response.json();

      setSelectedUserId("");
      fetchGroupUsers();
    } catch (error) {
      console.error("Error adding users in Group:", error.message);
    }
  };

  const fetchGroupUsers = () => {
    fetch(`/GetAllUserInAGroup/:${groupId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setGroupUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const delete_user = async (id) => {
    try {
      const data = await fetch(`DeleteUserFromGroup/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));

      setGroupUsers((prevUsers) => prevUsers.filter((user) => user.Id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = () => {
    fetch("/GetAllUsers")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const toggleDropdown = () => {
    console.log(showDropdown);
    setShowDropdown(!showDropdown);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handlePercentageInputChange = (userId, value) => {
    setUserPercentageShares((prevShares) => ({
      ...prevShares,
      [userId]: parseFloat(value) || 0,
    }));
  };

  const handlePercentageShares = async () => {
    setshowTransaction(false);
    try {
      const percentageSharesArray = selectedUsers.map((userId) => ({
        userId,
        percentageShare: userPercentageShares[userId] || 0,
      }));

      const response = await fetch(`/AddTranscationSplitbyRatio/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UsersArray: percentageSharesArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send percentage shares to the backend");
      }

      const data = await response.json();

      setSelectedUsers([]);
      setUserPercentageShares({});
      fetchGroupUsers();
    } catch (error) {
      console.error(
        "Error adding users in Group with percentage shares:",
        error.message
      );
    }
  };

  const fetchAllTransactions = () => {
    fetch("/GetAllTrancationsForAGroup")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAllTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const delete_transaction = async (id) => {
    try {
      const data = await fetch(`DeleteTransaction/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));

      setAllTransactions((prevTransaction) =>
        prevTransaction.filter((transaction) => transaction.Id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchATransactionDetail = (id) => {
    fetch(`/GetTranscationDetails/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTransactionDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const edit_transaction = (id) => {};

  const showTransactionDetails = (transaction) => {
    const details = `Transaction ID: ${transaction.Id}\nName: ${transaction.Name}\nCategory: ${transaction.Category}
    \nYour Share : ${transaction.UserShare.Id}`;
    window.alert(details);
    const confirmEdit = window.confirm(
      `${details}\n\nDo you want to edit this transaction?`
    );

    if (confirmEdit) {
      edit_transaction(transaction.Id);
    }
  };
  const onclickhandlerPS = () => {
    setShareType("percentage");
    setShowDropdown(false);
  };

  const onclickhandlerES = () => {
    setShareType("equal");
    setShowDropdown(false);
  };

  useEffect(() => {
    fetchGroupUsers();
    fetchUsers();
    fetchAllTransactions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <button
          onClick={() => {
            setShowUser(true);
          }}
          className="btn_AddUser"
        >
          Add User
        </button>
        {showUser && (
          <ul className="UserList">
            {users.map((user) => (
              <li key={user.Id} className="user">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedUserId.includes(user.Id)}
                    onChange={() => {
                      setSelectedUserId(user.Id);
                    }}
                    className="checkbox"
                  />
                  {user.Name}
                </label>
                <div onClick={handleAddUser} className="btn_Add">
                  Add
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            setshowTransaction(true);
          }}
        >
          Add transaction
        </button>
        {showTransaction && (
          <div className="input-form">
            <label>Total amount:</label>
            <input
              type="text"
              placeholder="Enter Total Amount"
              value={TotalAmount}
              onChange={(e) => {
                setTotalAmount(e.target.value);
              }}
              className="text"
            />

            <label>Transaction Name:</label>
            <input
              type="text"
              value={TransactionName}
              onChange={(e) => {
                setTransactionName(e.target.value);
              }}
              className="text"
            />

            <label>Category:</label>
            <input
              type="text"
              placeholder="Enter Category"
              value={TransactionType}
              onChange={(e) => {
                setTransactionType(e.target.value);
              }}
              className="text"
            />

            <div className="custom-dropdown">
              <button className="selected-option" onClick={toggleDropdown}>
                Share Type
              </button>
              {showDropdown && (
                <div className="dropdown-options">
                  <div
                    onClick={() => {
                      onclickhandlerES();
                    }}
                    id="ES"
                  >
                    Equal Share
                  </div>
                  <div
                    onClick={() => {
                      onclickhandlerPS();
                    }}
                    id="PS"
                  >
                    Percentage Share
                  </div>
                </div>
              )}
            </div>
            {ShareType === "equal" && (
              <EqualShareSection
                users={users}
                selectedUsers={selectedUsers}
                onCheckboxChange={handleCheckboxChange}
                onEqualShare={handleEqualshare}
              />
            )}
            {ShareType === "percentage" && (
              <PercentageShareSection
                users={users}
                selectedUsers={selectedUsers}
                onCheckboxChange={handleCheckboxChange}
                onPercentageInputChange={handlePercentageInputChange}
                onPercentageShare={handlePercentageShares}
              />
            )}
          </div>
        )}
      </div>
      <div>
        <h2>Group Users</h2>
        <ul className="users">
          {GroupUsers.map((user) => (
            <li key={user.Id} className="User">
              {user.Name} - {user.Id};
              <div
                onClick={() => {
                  delete_user(user.Id);
                }}
                className="delete"
              >
                X
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>All Transactions in the group</h2>
        <ul className="transactions">
          {AllTransactions.map((transaction) => (
            <li
              key={transaction.Id}
              onClick={() => showTransactionDetails(transaction)}
              className="transaction"
            >
              {transaction.Name} - {transaction.Category};
              <div
                onClick={() => {
                  delete_transaction(transaction.Id);
                }}
                className="delete"
              >
                X
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
