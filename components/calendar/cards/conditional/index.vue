<template>
  <calendar-cards-list
    v-if="displayType === 'list'"
    :display-type="displayType"
    :list="list"
  />
  <calendar-cards-tile v-else :display-type="displayType" :list="list"/>
</template>

<script setup lang="ts">
import {TCardEvent} from "../types";

type TConditionalProps = {
  list: TCardEvent[];
  displayType: "list" | "tile";
};
defineProps<TConditionalProps>();
</script>
