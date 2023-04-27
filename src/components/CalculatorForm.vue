<template>
  <q-card class="row q-pa-md">
    <!-- <div class="col-12"> -->
    <div class="col-12 row justify-between items-start">
      <span class="text-h6"> Simple Calculator </span>
      <q-btn
        class="q-mt-sm"
        size="sm"
        dense
        flat
        label="Try out demo version"
        type="submit"
        color="primary"
        @click="$emit('demoVersion', true)"
      />
    </div>

    <q-form
      ref="calculatorForm"
      @submit.prevent="onSubmit"
      @reset="onReset"
      class="row"
    >
      <q-input
        :class="[operation === 5 ? 'col-12' : 'col']"
        outlined
        dense
        type="number"
        v-model="number1"
        label="Number 1"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type a Number',
        ]"
      />

      <q-input
        v-if="operation !== 5"
        class="col-6 q-ml-sm"
        outlined
        dense
        type="number"
        v-model="number2"
        label="Number 2"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type a Number',
        ]"
      />

      <div class="col-12" v-if="operations">
        <q-radio
          v-model="operation"
          v-for="item in operations"
          :key="`Radio-op-btn-${item.id}`"
          :val="item.id"
          :label="item.type"
        />
      </div>

      <div class="col-12 text-right q-mt-md">
        <q-btn label="Calculate" type="submit" color="primary" :loading="loading"/>
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>

    <p class="text-h3 q-mt-md full-width text-center text-green">
      {{ result }}
    </p>
  </q-card>
</template>

<script setup>
import { computed, ref } from "vue";
import useQuasar from "quasar/src/composables/use-quasar.js";
import { useOperations } from "src/composables/operations";
const { getOperationsList, calculate } = useOperations();

const operations = computed(() => {
  return getOperationsList()
    .filter((item) => item.id !== 6)
    .sort((a, b) => (a.id < b.id ? -1 : 1));
});
const $q = useQuasar();

const calculatorForm = ref(null);

const number1 = ref(null);
const number2 = ref(null);
const operation = ref(1);
const result = ref(null);
const loading = ref(false);

const onSubmit = async () => {
  try {
    const isValidate = await calculatorForm.value.validate();

    if (!isValidate) return;

    loading.value = true;
    const payload = {
      number1: number1.value,
      number2: operation.value !== 5 ? number2.value : null,
      operationId: operation.value,
    };

    const operationResult = await calculate(payload);

    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Calculated Successfully",
      position: "bottom-right",
    });

    result.value = operationResult.result;

    setTimeout(() => {
      result.value = null;
    }, 10000);

  } finally {
    calculatorForm.value.reset();
    loading.value = false;
  }
};

const onReset = () => {
  number1.value = null;
  number2.value = null;
  operation.value = 1;
};
</script>

<style lang="scss" scoped></style>
