<template>
  <div class="overflow-x-auto">
    <div class="min-w-max">
      <div class="grid" :style="gridStyle">
        <div
          class="font-bold text-center bg-gray-100 border border-gray-300"
        ></div>
        <div
          v-for="hour in hours"
          :key="hour"
          class="font-bold text-center bg-gray-100 border border-gray-300"
        >
          {{ hour }}h
        </div>

        <template v-for="(room, r) in rooms" :key="r">
          <template v-for="(day, d) in days" :key="day">
            <div
              class="font-bold text-sm text-right pr-2 pt-1 col-span-1 bg-gray-50 border border-gray-300"
            >
              {{ room }}<br />{{ day }}
            </div>
            <div
              v-for="hour in hours"
              :key="hour + day + room"
              class="border border-gray-300 h-20 relative"
              :style="{ backgroundColor: suggestionColor(day, hour, room) }"
              @dragover.prevent
              @drop="onDrop($event, day, hour, room)"
            >
              <div
                v-for="(film, index) in getFilmsAt(day, hour, room)"
                :key="film.id + '-' + index"
                class="absolute top-0 left-0 right-0 bottom-0 m-1 rounded shadow text-white text-xs text-center p-1 cursor-move"
                :style="{ backgroundColor: genreColors[film.genre] || '#666' }"
                draggable="true"
                @dragstart="onDragStart($event, film)"
                @dblclick="removeFilm(day, hour, room, index)"
                :title="`Double-cliquez pour retirer`"
              >
                {{ film.title }}
              </div>
            </div>
          </template>
          <div class="col-span-full h-2 bg-black/10"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  days: Array,
  hours: Array,
  rooms: Array,
  genreColors: Object,
  suggestionColor: Function,
  getFilmsAt: Function,
  onDrop: Function,
  onDragStart: Function,
  removeFilm: Function,
  gridStyle: String,
});
</script>

<style scoped>
.grid {
  display: grid;
  border-top: 2px solid #ccc;
  border-left: 2px solid #ccc;
}
</style>
