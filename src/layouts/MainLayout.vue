<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-icon flat dense round name="calculate" color="primary" size="2rem" />

        <q-toolbar-title class="text-primary">
          Arithmetic Calculator
        </q-toolbar-title>

        <q-chip
          color="info"
          text-color="white"
          icon="attach_money"
          class="q-mr-lg"
        >
          {{ userBalance }}
        </q-chip>
        <q-btn
          flat
          color="red"
          text-color="red"
          label="Logout"
          :ripple="{ color: 'red' }"
          icon="logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import useQuasar from "quasar/src/composables/use-quasar.js";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "src/composables/user";

const $q = useQuasar();
const router = useRouter();

const { getUserBalance, getCurrentBalance } = useUser();

const userBalance = computed(() => {
  return getCurrentBalance();
});

const logout = () => {
  $q.localStorage.remove("token");
  router.push("/");
};

onMounted(async () => {
  await getUserBalance();
});
</script>
