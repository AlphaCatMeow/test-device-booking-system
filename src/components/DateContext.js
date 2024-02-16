import React, { createContext, useContext, useState } from 'react';
import dayjs from 'dayjs';

// 创建一个 Context
const DateContext = createContext();

// 创建一个提供者组件
export const DateProvider = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </DateContext.Provider>
    );
};

// 创建一个自定义钩子，以便在组件中更容易使用这个 Context
export const useDate = () => useContext(DateContext);
