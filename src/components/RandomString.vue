<template>
  <q-card>
    <q-card-section class="row items-start justify-center fit">
      <div v-if="!result">
        <div class="col-12 column">
          <span class="text-h6">Random String Generator</span>
          <span class="text-caption"> Service to generate Random Strings </span>
        </div>

        <div class="col-12 row justify-center">
          <q-form
            ref="randomStringForm"
            @submit.prevent="onSubmit"
            @reset="onReset"
            class="row q-gutter-sm"
          >
            <q-input
              class="col-6"
              outlined
              dense
              type="number"
              v-model="quantity"
              label="Quantity of random strings"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Please type a Number',
                (val) => (val > 0 && val <= 10) || 'Min 1 - Max 10',
              ]"
            />

            <q-input
              class="col"
              outlined
              dense
              type="number"
              v-model="length"
              label="Strings characters long"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Please type a Number',
                (val) => (val > 0 && val <= 20) || 'Min 1 - Max 20',
              ]"
            />

            <div class="col-12">
              <p class="text-subtitle2">Characters allowed:</p>
              <q-checkbox
                v-model="allowDigits"
                label="Numeric allowDigits (0-9)"
                color="teal"
              />
              <q-checkbox
                v-model="allowUpperalpha"
                label="Uppercase letters (A-Z)"
                color="orange"
              />
              <q-checkbox
                v-model="allowLoweralpha"
                label="Lowercase letters (a-z)"
                color="red"
              />
            </div>

            <div class="col">
              <q-btn-toggle
                size="sm"
                spread
                v-model="uniqueStrings"
                toggle-color="primary"
                :options="[
                  { label: 'uniqueStrings Strings', value: 'on' },
                  { label: 'Allow Identical Strings', value: 'off' },
                ]"
              />
            </div>

            <div class="col-12 text-right q-mt-md">
              <q-btn
                label="Generate String"
                type="submit"
                color="primary"
                :loading="loading"
              />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </div>
      </div>

      <div v-else>
        <div class="col-12 column">
          <span class="text-h6 text-green">Random Strings Generated</span>
        </div>
        <div class="col-12 row q-mt-lg">
          <span
            v-for="item in result"
            :key="`randomstring ${item}`"
            class="col-12 text-center"
            >{{ item }}</span
          >
        </div>
        <div class="col row justify-center q-mt-md">
          <q-btn
            @click="result = null"
            label="Go back and get more"
            flat
            type="submit"
            color="primary"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { api } from "src/boot/axios";
import useQuasar from "quasar/src/composables/use-quasar.js";

import { useOperations } from "src/composables/operations";
const { getRandomStrings } = useOperations();

const $q = useQuasar();

const quantity = ref(null);
const length = ref(null);
const allowDigits = ref(true);
const allowUpperalpha = ref(true);
const allowLoweralpha = ref(true);
const uniqueStrings = ref("on");

const randomStringForm = ref(null);
const result = ref(null);
const loading = ref(false);

const onSubmit = async () => {
  try {
    const isValidate = await randomStringForm.value.validate();

    if (!isValidate) return;
    loading.value = true;
    const operationResult = await getRandomStrings({
      quantity: quantity.value,
      length: length.value,
      allowDigits: allowDigits.value ? "on" : "off",
      allowUpperalpha: allowUpperalpha.value ? "on" : "off",
      allowLoweralpha: allowLoweralpha.value ? "on" : "off",
      uniqueStrings: uniqueStrings.value,
    });

    result.value = operationResult.result;

    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Random String Generated",
      position: "bottom-right",
    });

  } finally {
    randomStringForm.value.reset();
    loading.value = false;
  }
};

const onReset = () => {
  quantity.value = null;
  length.value = null;
  allowDigits.value = true;
  allowUpperalpha.value = true;
  allowLoweralpha.value = true;
  uniqueStrings.value = "on";
};
</script>

<style lang="scss" scoped></style>
