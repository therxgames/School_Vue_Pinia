<template>
	<div class="d-flex w-100 align-items-center gap-2">
		<!-- <span class="d-flex flex-grow-1">
			<button class="d-inline-flex align-items-center justify-content-center gap-2 w-100"
				v-tooltip="{ title: 'Добавление в избранное доступно только авторизованным пользователям.' }">
				<svg-icon name="star" />
				В избранное
			</button>
		</span> -->

		<span class="" v-if="!isPassed()">
			<button 
				class="d-inline-flex align-items-center justify-content-center gap-2 w-100 event-item-btn"
				v-tooltip="{ title: 'Добавить в календарь' }"
				@click="exportEventIsc">
					<svg-icon name="calendar-add" />
			</button>
		</span>

		<span class="" @click="copyToBuffer">
			<button 
				class="d-inline-flex align-items-center justify-content-center gap-2 w-100 event-item-btn"
				v-tooltip="{ title: 'Скопировать ссылку' }">
					<svg-icon name="repost" />
			</button>
		</span>

		<calendar-detail-tooltip-copy :count-items="tooltipCopyItems" />
	</div>
</template>

<script setup lang="ts">
import { exportEventIsc } from '../../helpers';

const props = defineProps({
  isPassed: {
    type: Function,
		required: true,
  }
});

const tooltipCopyItems = ref(0);

const copyToBuffer = async () => {
	const urlData = useRequestURL();

	tooltipCopyItems.value += 1;
	await copyToClipboard(urlData.href);
};
</script>

<style lang="scss" scoped>
.event-item-btn {
	padding-top: 0.625rem;
	padding-bottom: 0.625rem;
	padding-left: 0.75rem;
	padding-right: 0.75rem;
	border-radius: 0.5rem;
	background: transparent;
	color: rgb(37, 76, 232);
	border: 1px solid rgb(37, 76, 232, 0.3);

	&:hover {
		color: #FFF;
		background: #2876fb;
	}
}
</style>
  