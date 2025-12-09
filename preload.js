const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {

    saveUser: (email, password, role) =>
        ipcRenderer.invoke("save-user", { email, password, role }),

    checkLogin: (email, password) =>
        ipcRenderer.invoke("check-login", { email, password }),

    savePlan: (plan_type, months, price, facilities) =>
        ipcRenderer.invoke("save-plan", { plan_type, months, price, facilities }),

    getPlans: () =>
        ipcRenderer.invoke("get-plans"),

    updatePlan: (data) =>
        ipcRenderer.invoke("update-plan", data),

    deletePlan: (id) =>
        ipcRenderer.invoke("delete-plan", id),

    // Members
  saveMember: (member) => ipcRenderer.invoke("save-member", member),
  getMembers: () => ipcRenderer.invoke("get-members"),
  deleteMember: (id) => ipcRenderer.invoke("delete-member", id),
  updateMember: (data) => ipcRenderer.invoke("update-member", data),

   // Trainers
  saveTrainer: (trainer) => ipcRenderer.invoke("save-trainer", trainer),
  getTrainers: () => ipcRenderer.invoke("get-trainers"),
  deleteTrainer: (id) => ipcRenderer.invoke("delete-trainer", id),
  updateTrainer: (data) => ipcRenderer.invoke("update-trainer", data),

   countMembers: () => ipcRenderer.invoke("count-members"),
    countTrainers: () => ipcRenderer.invoke("count-trainers"),
    totalRevenue: () => ipcRenderer.invoke("total-revenue"),
    countActiveToday: () => ipcRenderer.invoke("active-members"),

});
