import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user.store";
import { useRecords } from "./records";


export const useOperations = () => {
    const userStore = useUserStore();
    const { getUserRecords } = useRecords()

    const findOperationList = async () => {
        try {
            const { data } = await api.get('/operations')
            userStore.setOperationList(data.Items)
        } catch (error) {
            throw new Error('Error getting user balance')
        }
    }

    const getOperationsList = () => userStore.getOperationsList

    const calculate = async (payload) => {
        try {
            const { data } = await api.post('/calculator', payload)
            userStore.setCurrentBalance(data.balance)
            getUserRecords()
            return data
        } catch (error) {
            throw new Error(error)
        }
    }

    const getRandomStrings = async (payload) => {
        try {
            const { data } = await api.post('/randomString', payload)
            userStore.setCurrentBalance(data.balance)
            getUserRecords()
            return data
        } catch (error) {
            throw new Error(error)
        }
    }

    return {
        findOperationList,
        getOperationsList,
        calculate,
        getRandomStrings
    }
}