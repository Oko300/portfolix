import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext();

export const Tabs = ({ children, defaultValue }) => {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children }) => (
  <div className="flex border-b border-gray-200 mb-4">{children}</div>
);

export const TabsTrigger = ({ children, value }) => {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active === value
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value }) => {
  const { active } = useContext(TabsContext);
  return active === value ? <div>{children}</div> : null;
};