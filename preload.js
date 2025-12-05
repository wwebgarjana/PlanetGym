const { contextBridge, ipcRenderer } = require("electron");

// Main IPC access (raw invoke)
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (...args) => ipcRenderer.invoke(...args)
  }
});

// Custom API functions for your app
contextBridge.exposeInMainWorld("api", {
  
  // Save User
  saveUser: (email, password, role) =>
    ipcRenderer.invoke("save-user", { email, password, role }),

  // Check Login
  checkLogin: (email, password) =>
    ipcRenderer.invoke("check-login", { email, password }),

  // Save Plan
  savePlan: (plan_type, months, price, facilities) =>
    ipcRenderer.invoke("save-plan", {
      plan_type,
      months,
      price,
      facilities
    }),

  // Get Plans
  getPlans: () =>
    ipcRenderer.invoke("get-plans")
});
