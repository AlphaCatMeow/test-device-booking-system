import React, { useState } from "react";
import { Modal } from "antd"; // 引入Modal组件
import "./DeviceTimeline.css"; // 确保引入了CSS样式
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

const DeviceTimeline = ({ deviceId }) => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

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
      // 在这里调用 showPromiseConfirm 来处理删除确认
      showPromiseConfirm();
    }
  };

  const showPromiseConfirm = () => {
    confirm({
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleFilled />,
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {setSelectedBlocks([]);},
    });
  };

  return (
    <div className="device-timeline" onMouseLeave={() => setIsSelecting(false)}>
      <div className="time-blocks">
        {Array.from({ length: 48 }).map((_, index) => (
          <div
            key={index}
            className={`time-block ${
              selectedBlocks.includes(index) ? "selected" : ""
            } ${index < disabledUntilBlock ? "disabled" : ""}`}
            onMouseDown={() => handleMouseDown(index)}
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
