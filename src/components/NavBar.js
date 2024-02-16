import "./NavBar.css";
import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

const NavBar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    onDateSelect(dateString); // 通知父组件选中的日期已更改
  };

  return (
    <div className="navbar-container">
      <DatePicker
        defaultValue={dayjs()} // 设置DatePicker的默认值为当前日期
        size="large"
        onChange={(date, dateString) => onDateSelect(dateString)}
      />
      <Button type="primary" style={{ marginLeft: "20px" }}>
        我的预订
      </Button>
    </div>
  );
};

export default NavBar;
