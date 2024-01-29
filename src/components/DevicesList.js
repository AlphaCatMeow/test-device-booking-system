import React from 'react';
import DeviceTimeline from './DeviceTimeline'; // 这将是您的时间轴组件

// 定义6个设备的信息
const devices = [
  { id: 1, name: 'HIL 1#' },
  { id: 2, name: 'HIL 2#' },
  { id: 3, name: '集成 1#' },
  { id: 4, name: '集成 2#' },
  { id: 5, name: 'BT 1#' },
  { id: 6, name: 'BT 2#' }
];

const DevicesList = () => {
  return (
    <div className="devices-list">
      {devices.map(device => (
        <div key={device.id} className="device">
          <h3>{device.name}</h3>
          <DeviceTimeline deviceId={device.id} />
        </div>
      ))}
    </div>
  );
};

export default DevicesList;
