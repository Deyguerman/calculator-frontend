<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-md full-width" style="max-width: 500px">
          <q-form
            ref="loginForm"
            @submit.prevent="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <h4 class="text-center text-weight-bold q-mt-md">Login</h4>

            <q-input
              filled
              v-model="email"
              label="Username"
              hint="User email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type your username',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              filled
              type="password"
              v-model="password"
              label="Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please type your password',
                (val) =>
                  val.length >= 8 || 'Password must have at least 8 characters',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>

            <div>
              <q-btn
                :loading="loading"
                class="full-width"
                label="Login"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import useQuasar from "quasar/src/composables/use-quasar.js";
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const loginForm = ref(null);

const email = ref(null);
const password = ref(null);
const loading = ref(false);

const onSubmit = async () => {
  try {
    const isValidate = await loginForm.value.validate();

    if (!isValidate) return;

    const payload = {
      email: email.value,
      password: password.value,
    };

    loading.value = true;
    const { data } = await api.post("/users/login", payload);

    $q.localStorage.set("token", data.token);
    router.push({ path: "/app" });
  } catch (error) {
    console.log(error);
  } finally {
    loginForm.value.reset();
    loading.value = false;
  }
};

const onReset = () => {
  email.value = null;
  password.value = null;
};
</script>

<style lang="scss" scoped></style>
