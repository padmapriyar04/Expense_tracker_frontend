import React from 'react';
import UserList from './UserList';

const EqualShareSection = ({ users, selectedUsers, onCheckboxChange, onEqualShare,setshowTransaction,showTransaction }) => (
  <div>
    <h3>Select Users for Equal Share:</h3>
    <UserList users={users} selectedUsers={selectedUsers} onCheckboxChange={onCheckboxChange} />
    <div onClick={onEqualShare}>Add Equal split</div>
  </div>
);

export default EqualShareSection;