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

      saveMember: (member) =>
        ipcRenderer.invoke("save-member", member),

    getMembers: () =>
        ipcRenderer.invoke("get-members")
});
