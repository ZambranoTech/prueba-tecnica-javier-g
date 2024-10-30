import { create } from "zustand";

export const useStore = create((set) => ({
  UsersTable: {
    open: false,
    formMode: -1,
    userSelected: {
      username: "",
      email: "",
    },
  },
  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),
  changeOpen: (value) => set({ open: value }),
  changeFormMode: (value) => set({ formMode: value }),
  changeSelectedUser: (user) => {
    set({ userSelected: { ...user } });
  },
}));
