import React from 'react';
import './App.css';
import NavBar from './components/NavBar'; // 导入NavBar组件
import DevicesList from './components/DevicesList'; // 导入DevicesList组件

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar /> {/* 使用NavBar组件 */}
      </header>
      <main>
        {/* 移除了原有的占位符内容，并添加了DevicesList组件来展示设备列表和时间轴 */}
        <DevicesList />
      </main>
    </div>
  );
}

export default App;
