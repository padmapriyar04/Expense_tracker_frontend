import React from 'react';
import GroupUserCheckbox from './GroupUserCheckbox';

const UserList = ({ users, selectedUsers, onCheckboxChange }) => (
  <ul>
    {users.map((user) => (
      <li key={user.Id}>
        <GroupUserCheckbox
          user={user}
          isChecked={selectedUsers.includes(user.Id)}
          onChange={() => onCheckboxChange(user.Id)}
        />
      </li>
    ))}
  </ul>
);

export default UserList;