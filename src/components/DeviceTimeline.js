import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import "./DeviceTimeline.css";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

const DeviceTimeline = ({ deviceId, selectedDate }) => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasConfirmedOrCancelled, setHasConfirmedOrCancelled] = useState(false);
  const [reservedBlocks, setReservedBlocks] = useState([]);// 在组件的开始处获取预订信息并设置状态

  const devices = [
    { id: 1, name: "HIL 1#" },
    { id: 2, name: "HIL 2#" },
    { id: 3, name: "集成 1#" },
    { id: 4, name: "集成 2#" },
    { id: 5, name: "BT 1#" },
    { id: 6, name: "BT 2#" },
  ];

  const getDeviceNameById = (deviceId) => {
    const device = devices.find((device) => device.id === deviceId);
    return device ? device.name : undefined;
  };

  // 获取当前设备名称
  const deviceName = getDeviceNameById(deviceId);

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
      setSelectedBlocks((prev) => {
        // 确保只有在实际添加新的时间块时才更新状态
        if (!prev.includes(index)) {
          return [...prev, index];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (selectedBlocks.length > 0 && !isModalVisible) {
      // 只有当有新的时间块被选中时才显示模态框
      showPromiseConfirm();
    }
  };

  const calculateTimeRange = () => {
    if (selectedBlocks.length > 0) {
      const blockDurationMinutes = 30; // 每个时间块代表30分钟
      const startTimeIndex = Math.min(...selectedBlocks);
      const endTimeIndex = Math.max(...selectedBlocks) + 1; // 加1因为结束时间是下一个时间块的开始

      // 计算小时和分钟
      const startHours = Math.floor(
        (startTimeIndex * blockDurationMinutes) / 60
      );
      const startMinutes = (startTimeIndex * blockDurationMinutes) % 60;
      const endHours = Math.floor((endTimeIndex * blockDurationMinutes) / 60);
      const endMinutes = (endTimeIndex * blockDurationMinutes) % 60;

      // 格式化时间为24小时制，精确到半小时
      const startTime = `${startHours
        .toString()
        .padStart(2, "0")}:${startMinutes.toString().padStart(2, "0")}`;
      const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`;

      return { startTime, endTime };
    }
    return { startTime: null, endTime: null };
  };

  function blockToTime(blockIndex) {
    // 每个时间块代表30分钟，一天有48个时间块
    const hours = Math.floor(blockIndex / 2); // 每两个时间块代表一个小时
    const minutes = (blockIndex % 2) * 30; // 每个时间块的分钟数，要么是0，要么是30

    // 将小时和分钟转换为字符串，并确保它们有两位数字
    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");

    // 返回时间字符串
    return `${hoursStr}:${minutesStr}`;
  }

  // 新增一个函数来检查localStorage并设置默认状态
  const initializeAvailability = () => {
    const bookings = localStorage.getItem("bookings");
    if (!bookings) {
      // 如果localStorage中没有预订信息，根据当前时间初始化状态
      const currentTime = new Date();
      const currentBlock =
        currentTime.getHours() * 2 + (currentTime.getMinutes() >= 30 ? 1 : 0);
      const availability = Array.from({ length: 48 }, (_, index) =>
        index >= currentBlock ? "available" : "unavailable"
      );
      localStorage.setItem(
        "bookings",
        JSON.stringify({ [selectedDate]: availability })
      );
    }
  };

  useEffect(() => {
    // 初始化或检索可用性状态，并设置reservedBlocks
    const bookings = JSON.parse(localStorage.getItem('bookings')) || {};
    const deviceBookings = bookings[deviceId] || {};
    const dateBookings = deviceBookings[selectedDate] || [];
    const reserved = dateBookings.map(booking => booking.block);
    setReservedBlocks(reserved);
  }, [deviceId, selectedDate]); // 依赖项包括设备ID和选定的日期

  const showPromiseConfirm = () => {
    const { startTime, endTime } = calculateTimeRange();
    if (startTime !== null && endTime !== null) {
      setIsModalVisible(true);
      confirm({
        title: "确认预订?",
        icon: <ExclamationCircleFilled />,
        content: `请确认预订${selectedDate}从${startTime}到${endTime}使用${deviceName}？`, // 修改弹框内容以包含selectedDate
        onOk() {
          setIsModalVisible(false);
          setHasConfirmedOrCancelled(true);
          // 假设 'bookings' 是存储在 localStorage 中的数组，用于跟踪所有预订
          const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
          // 获取当前在localStorage中存储的预订信息
          const deviceBookings = bookings[deviceId] || {};
          const dateBookings = deviceBookings[selectedDate] || [];

          // 更新选中的时间块预订信息
          const updatedBookings = selectedBlocks.map(block => ({
            block,
            reservedBy: '预订人ID2', // 这里应该替换为实际的预订人ID
            startTime: block * 30, // 示例计算，需要根据实际情况调整
            endTime: (block + 1) * 30 // 示例计算，需要根据实际情况调整
          }));

            // 合并新旧预订信息，这里需要一个逻辑来处理时间块的更新，避免重复预订
          const mergedBookings = [...dateBookings, ...updatedBookings].reduce((acc, current) => {
            const found = acc.find(item => item.block === current.block);
            if (found) {
              // 如果找到了相同的时间块，可以选择更新逻辑，例如：覆盖或合并信息
              found.reservedBy = current.reservedBy;
              found.startTime = current.startTime;
              found.endTime = current.endTime;
            } else {
              acc.push(current);
            }
            return acc;
          }, []);

          deviceBookings[selectedDate] = mergedBookings;
          bookings[deviceId] = deviceBookings;

          // 更新localStorage中的预订信息
          localStorage.setItem('bookings', JSON.stringify(bookings));

          // 更新reservedBlocks状态以包含新预订的时间块
          setReservedBlocks(prev => [...new Set([...prev, ...selectedBlocks])]);

          // 清除selectedBlocks状态，因为预订已完成
          setSelectedBlocks([]);
        },
        onCancel() {
          setIsModalVisible(false);
          setSelectedBlocks([]);
          setHasConfirmedOrCancelled(true);
        },
      });
    }
  };

  return (
    <div
      className="device-timeline"
      onMouseLeave={() => {
        if (
          selectedBlocks.length > 0 &&
          !isModalVisible &&
          !hasConfirmedOrCancelled
        ) {
          showPromiseConfirm();
        }
        setIsSelecting(false);
      }}
    >
      <div className="time-blocks">
        {Array.from({ length: 48 }).map((_, index) => (
          <div
            key={index}
            className={`time-block ${selectedBlocks.includes(index) ? "selected" : ""} ${index < disabledUntilBlock || reservedBlocks.includes(index) ? "disabled" : ""} ${reservedBlocks.includes(index) ? "reserved" : ""}`} // 添加reserved类
            onMouseDown={(event) => !reservedBlocks.includes(index) && handleMouseDown(event, index)} // 排除已预订的时间块
            onMouseEnter={() => !reservedBlocks.includes(index) && handleMouseEnter(index)} // 排除已预订的时间块
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
