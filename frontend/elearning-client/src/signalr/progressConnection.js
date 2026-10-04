import * as  signalR from "@microsoft/signalr";

export const createProgressConnection = (token) => {
    return new signalR.HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_SIGNALR_URL || "https://localhost:7214/hubs/progress", {
        accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
};
