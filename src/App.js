import React, { useState } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import DevicesList from './components/DevicesList';
import dayjs from 'dayjs'; // 引入dayjs库来处理日期

function App() {
  // 使用dayjs获取当前日期，并格式化为'YYYY-MM-DD'格式作为默认选中的日期
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleDateSelect = (date) => {
    setSelectedDate(date); // 更新选中的日期
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar onDateSelect={handleDateSelect} />
      </header>
      <main>
        <DevicesList selectedDate={selectedDate} />
      </main>
    </div>
  );
}

export default App;
