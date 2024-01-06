import React from 'react';

const GroupUserCheckbox = ({ user, isChecked, onChange }) => (
  <label>
    <input type="checkbox" checked={isChecked} onChange={onChange} />
    {user.Name}
  </label>
);

export default GroupUserCheckbox;