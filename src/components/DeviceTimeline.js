import React, { useState, useContext } from "react";
import { Modal } from "antd";
import "./DeviceTimeline.css";
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

const DeviceTimeline = ({ deviceId, selectedDate }) => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const devices = [
    { id: 1, name: 'HIL 1#' },
    { id: 2, name: 'HIL 2#' },
    { id: 3, name: '集成 1#' },
    { id: 4, name: '集成 2#' },
    { id: 5, name: 'BT 1#' },
    { id: 6, name: 'BT 2#' }
  ];
  
  const getDeviceNameById = (deviceId) => {
    const device = devices.find(device => device.id === deviceId);
    return device ? device.name : undefined;
  };
  
  // Use DeviceContext or a function to get the device name
  // const { getDeviceNameById } = useContext(DeviceContext);
  const deviceName = getDeviceNameById(deviceId); // Replace with actual function/context

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const disabledUntilBlock = currentHour * 2 + (currentMinute >= 30 ? 1 : 0);

  const handleMouseDown = (event, index) => {
    event.preventDefault(); // 阻止默认行为，避免拖动等默认事件
    setIsSelecting(true);
    if (index >= disabledUntilBlock) {
      setSelectedBlocks([index]);
    }
  };

  const handleMouseEnter = (index) => {
    if (isSelecting && index >= disabledUntilBlock) {
      setSelectedBlocks((prev) => [...new Set([...prev, index])]);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (selectedBlocks.length > 0) {
      showPromiseConfirm();
    }
  };

  const calculateTimeRange = () => {
    if (selectedBlocks.length > 0) {
      const blockDurationMinutes = 30; // 每个时间块代表30分钟
      const startTimeIndex = Math.min(...selectedBlocks);
      const endTimeIndex = Math.max(...selectedBlocks) + 1; // 加1因为结束时间是下一个时间块的开始
  
      // 计算小时和分钟
      const startHours = Math.floor(startTimeIndex * blockDurationMinutes / 60);
      const startMinutes = (startTimeIndex * blockDurationMinutes) % 60;
      const endHours = Math.floor(endTimeIndex * blockDurationMinutes / 60);
      const endMinutes = (endTimeIndex * blockDurationMinutes) % 60;
  
      // 格式化时间为24小时制，精确到半小时
      const startTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  
      return { startTime, endTime };
    }
    return { startTime: null, endTime: null };
  };

  const showPromiseConfirm = () => {
    const { startTime, endTime } = calculateTimeRange();
    if (startTime !== null && endTime !== null) {
      setIsModalVisible(true);
      confirm({
        title: '预定设备?',
        icon: <ExclamationCircleFilled />,
        content: `请确认预订${selectedDate}从${startTime}到${endTime}使用${deviceName}？`, // 修改弹框内容以包含selectedDate
        onOk() {
          setIsModalVisible(false);
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('预定失败！'));
        },
        onCancel() {
          setIsModalVisible(false);
          setSelectedBlocks([]);
        },
      });
    }
  };

  return (
    <div className="device-timeline" onMouseLeave={() => {
      if (selectedBlocks.length > 0 && !isModalVisible) {
        showPromiseConfirm();
      }
      setIsSelecting(false);
    }}>
      <div className="time-blocks">
        {Array.from({ length: 48 }).map((_, index) => (
          <div
            key={index}
            className={`time-block ${selectedBlocks.includes(index) ? "selected" : ""} ${index < disabledUntilBlock ? "disabled" : ""}`}
            onMouseDown={(event) => handleMouseDown(event, index)} // 传递事件对象和索引
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseUp={handleMouseUp}
          ></div>
        ))}
      </div>

      <div className="time-label-blocks">
        {Array.from({ length: 50 }).map((_, index) => (
          <div key={index} className="time-label-block">
            {index % 2 === 0 && <div className="time-label">{index / 2}</div>}
          </div>
        ))}
      </div>

    </div>
  );
};

export default DeviceTimeline;
