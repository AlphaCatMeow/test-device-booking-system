import React, { useState } from "react";
import { Modal } from "antd"; // 引入Modal组件
import "./DeviceTimeline.css"; // 确保引入了CSS样式

const DeviceTimeline = ({ deviceId }) => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const disabledUntilBlock = currentHour * 2 + (currentMinute >= 30 ? 1 : 0);

  const handleMouseDown = (index) => {
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
      setShowModal(true);
    }
  };

  const handleOk = () => {
    // 这里可以添加预订逻辑
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedBlocks([]); // 取消选择时清空选中的时间块
  };

  return (
    <div className="device-timeline" onMouseLeave={() => setIsSelecting(false)}>
      {Array.from({ length: 48 }).map((_, index) => (
        <div>
          <div key={index} className="time-block-wrapper">
          <div
            className={`time-block ${
              selectedBlocks.includes(index) ? "selected" : ""
            } ${index < disabledUntilBlock ? "disabled" : ""}`}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseUp={handleMouseUp}
          ></div>
        </div>  
        
        <div className="time-hour">
          {index % 2 === 0 && ( // 每个小时的开始处添加小时数
            <div className="time-label">{index / 2}</div>
          )}
        </div>
        </div>
      ))}
      <Modal
        title="确认预订"
        visible={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>您是否要预订设备{deviceId}在选中的时间段？</p>
      </Modal>
    </div>
  );
};

export default DeviceTimeline;
