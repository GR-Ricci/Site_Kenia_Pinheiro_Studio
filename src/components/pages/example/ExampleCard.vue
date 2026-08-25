<script setup>
defineProps({
  nome: String,
  cargo: String,
  descricao: String,
})
</script>

<template>
  <div class="card">
    <h2>{{ nome }}</h2>
    <h3>{{ cargo }}</h3>
    <p>{{ descricao }}</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
h2 {
  margin: 0;
}
h3 {
  color: #555;
}
</style>
