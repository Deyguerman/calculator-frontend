<template>
  <q-table
    title="Records"
    :rows="rowsTable"
    :columns="columns"
    row-key="id"
    class="col"
    :loading="loading"
    :filter="filter"
  >
    <template v-slot:top-right>
      <q-input
        style="min-width: 280px"
        clearable
        v-model="filter"
        placeholder="Search"
        class="q-mr-md"
        label="Search by operation type"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn
          dense
          flat
          round
          color="grey"
          field="edit"
          icon="delete"
          @click="openDeleteModal(props.row)"
        ></q-btn>
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center q-pa-md">
        <p class="full-width text-h5">
          Attention!
          <q-separator inset class="full-width q-mt-sm" />
        </p>
        <div class="row">
          <p>
            Please, confirm to delete this
            <span class="text-weight-bold text-grey-8">
              {{ itemToDelete.operation }}
            </span>
            operation from your records table.
          </p>
          <span class="text-caption text-blue-8 q-mt-md">
            *Delete this record will not recover your spent credits.
          </span>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="gray"
          @click="confirmDeleteModalHandler(false)"
          v-close-popup
        />
        <q-btn
          outline
          label="Delete"
          color="red"
          @click="confirmDeleteModalHandler(true)"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useOperations } from "src/composables/operations";
import { useRecords } from "src/composables/records";
import { computed, onMounted, ref } from "vue";
const { getUserRecords, deleteRecord, loading, rowsTable } = useRecords();
const { getOperationsList } = useOperations();

const columns = [
  {
    name: "id",
    required: true,
    label: "Id",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    style: "width: 10px",
  },
  {
    name: "operation_id",
    align: "center",
    label: "Operation",
    field: (row) =>
      operations.value.find((item) => item.id === row.operation_id)?.type,
    sortable: true,
  },
  { name: "amount", label: "Cost", field: "amount", sortable: true },
  {
    name: "response",
    label: "Response",
    field: "operation_response",
    classes: "recods-table-col-response",
  },
  {
    name: "date",
    label: "Date",
    field: (row) => new Date(row.date).toLocaleString(),
    sortable: true,
    sort: (a, b) => (a.date - b.date ? 1 : -1),
  },
  {
    name: "action",
    align: "center",
    label: "Actions",
    field: "",
  },
];

const filter = ref("");
const confirm = ref(false);
const itemToDelete = ref({});

const operations = computed(() => {
  return getOperationsList();
});

// Methods
const openDeleteModal = (item) => {
  item.operation = operations.value.find(
    (operation) => operation.id === item.operation_id
  )?.type;
  itemToDelete.value = item;
  confirm.value = true;
};

const confirmDeleteModalHandler = async (doDelete = false) => {
  if (!doDelete) {
    itemToDelete.value = {};
    confirm.value = false;
  }

  await deleteRecord(itemToDelete.value);
  rowsTable.value = rowsTable.value.filter(
    (elem) => elem.id !== itemToDelete.value.id
  );
  itemToDelete.value = {};
  confirm.value = false;
};

// Life Cycles
onMounted(async () => {
  await getUserRecords();
});
</script>

<style lang="scss">
.recods-table-col-response {
  max-width: 200px;
  overflow-wrap: break-word;
  white-space: break-spaces !important;
}
</style>
