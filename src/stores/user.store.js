import { defineStore } from 'pinia';

export const useUserStore = defineStore('counter', {
  state: () => ({
    currentBalance: 0,
    operationsList: []
  }),
  getters: {
    getCurrentBalance: (state) => state.currentBalance,
    getOperationsList: (state) => state.operationsList,
  },
  actions: {
    setCurrentBalance(balance) {
      this.currentBalance = balance;
    },
    setOperationList(operations) {
      this.operationsList = operations;
    },
  },
});
