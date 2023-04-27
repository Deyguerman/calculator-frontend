import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user.store";

export const useUser = () => {
    const userStore = useUserStore();

    const getUserBalance = async () => {
        try {
            const { data } = await api.get('/users/balance')
            userStore.setCurrentBalance(data.currentBalance)
        } catch (error) {
            throw new Error('Error getting user balance')
        }
    }

    const getCurrentBalance = () => userStore.getCurrentBalance

    const setNewBalance = balance => userStore.setCurrentBalance(balance)

    return {
        getUserBalance,
        getCurrentBalance,
        setNewBalance
    }
}