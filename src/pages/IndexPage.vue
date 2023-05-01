<template>
  <q-page class="row justify-between items-start q-pa-md">
    <div class="col-12 row justify-between q-mb-md">
      <InstructionsCard class="col-12 col-md-3" />

      <component
        :is="calculatorComponent"
        @demoVersion="handleDemoVersion"
        class="col-12"
        :class="[
          $q.screen.lt.md ? 'q-mt-md' : '',
          showDemoVersion ? 'col-md-2' : 'col-md-4',
        ]"
      />

      <RandomString
        class="col-12 col-md-4"
        :class="[$q.screen.lt.md ? 'q-mt-md' : '']"
      />
    </div>

    <div class="col-12 row justify-center" style="min-height: 400px" v-if="true">
      <RecordsTable />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import CalculatorForm from "../components/CalculatorForm.vue";
import CalculatorDemo from "../components/calculator-demo/CalculatorDemo.vue";
import RandomString from "../components/RandomString.vue";
import RecordsTable from "src/components/RecordsTable.vue";
import InstructionsCard from "src/components/InstructionsCard.vue";
import { useOperations } from "src/composables/operations";

const showDemoVersion = ref(false);
const calculatorComponent = computed(() =>
  showDemoVersion.value === false ? CalculatorForm : CalculatorDemo
);
const { findOperationList } = useOperations();

const handleDemoVersion = (value) => {
  showDemoVersion.value = value;
};

onMounted(async () => {
  await findOperationList();
});
</script>
