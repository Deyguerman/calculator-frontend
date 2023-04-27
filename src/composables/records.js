import { api } from "src/boot/axios";
import { ref } from "vue";

const loading = ref(false)
const rowsTable = ref([])

export const useRecords = () => {

    const getUserRecords = async (payload) => {
        try {
            loading.value = true
            
            const { data } = await api.get('/records', { params: payload })
            rowsTable.value = data.Items
            totalRows.value = data.total

            return data
        } catch (error) {
            throw new Error('Error getting user records')
        } finally {
            setTimeout(() => {
                loading.value = false
            }, 1000);
        }
    }

    const deleteRecord = async (record) => {
        try {
            const { data } = await api.delete('/records', {
                data: record
            })
            return data

        } catch (error) {
            console.log(error)
            throw new Error('Error deleting record')
        }
    }

    return {
        // Variables
        loading,
        rowsTable,

        // Methods
        getUserRecords,
        deleteRecord
    }
}