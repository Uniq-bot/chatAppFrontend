"use client";

export const setPostNavToast = (payload) => {
  try {
    sessionStorage.setItem("postNavToast", JSON.stringify(payload));
  } catch {}
};

export const peekPostNavToast = () => {
  try {
    const raw = sessionStorage.getItem("postNavToast");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const consumePostNavToast = () => {
  try {
    const raw = sessionStorage.getItem("postNavToast");
    if (!raw) return null;
    sessionStorage.removeItem("postNavToast");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
