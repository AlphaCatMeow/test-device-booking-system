import React from 'react';
import { DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const NavBar = () => {
    return (
      <div className="navbar">
        <DatePicker defaultValue={dayjs()} size="large"/>
        <Button type="primary" style={{ marginLeft: '20px' }}>预定</Button>
      </div>
    );
  };

export default NavBar;
