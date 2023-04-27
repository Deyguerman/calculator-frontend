<template>
  <q-card>
    <q-card-section>
      <span class="text-h6 text-center">Instructions</span>
      <p>
        User’s will have a starting credit/balance ($200). Each request will be
        deducted from the user’s balance. If the user’s balance isn’t enough to
        cover the request cost, the request shall be denied.
      </p>

      <p class="text-h6 text-bold">Cost per request</p>
      <q-list dense bordered class="rounded-borders">
        <q-item v-for="item in operations" :key="item.name">
          <q-item-section>
            {{
              item.id === 6
                ? `${item.type} (Cost per String)`
                : item.type
            }}
          </q-item-section>
          <q-item-section side>
            <q-badge align="middle" color="info" text-color="white">
              <q-icon name="attach_money" />
              {{ item.cost }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useOperations } from "src/composables/operations";
import { computed } from "vue";

const { getOperationsList } = useOperations();
const operations = computed(() => {
  return getOperationsList().sort((a, b) => (a.cost < b.cost ? -1 : 1));
});
</script>

<style lang="scss" scoped></style>
