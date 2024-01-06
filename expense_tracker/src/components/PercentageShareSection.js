import React from 'react';
import UserList from './UserList';

const PercentageShareSection = ({ users, selectedUsers, onCheckboxChange, onPercentageInputChange, onPercentageShare,setshowTransaction,showTransaction }) => (
  <div>
    <h3>Enter Users and Percentage Share:</h3>
    <form>
      <UserList users={users} selectedUsers={selectedUsers} onCheckboxChange={onCheckboxChange} />
      {users.map((user) => (
        <div key={user.Id}>
          <label>User Name: {user.Name}</label>
          {selectedUsers.includes(user.Id) && (
            <input
              type="number"
              placeholder="Enter percentage share"
              value={user.percentageShare || ''}
              onChange={(e) => onPercentageInputChange(user.Id, e.target.value)}
            />
          )}
        </div>
      ))}
    </form>
    <div onClick={onPercentageShare}>Add</div>
  </div>
);

export default PercentageShareSection;