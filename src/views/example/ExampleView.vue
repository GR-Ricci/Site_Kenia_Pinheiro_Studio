<script setup>
import ExampleCard from '@/components/pages/example/ExampleCard.vue'
</script>

<template>
  <div>
    <h1>Nossa Equipe</h1>
    <ExampleCard
      nome="Kenia Pinheiro"
      cargo="Cabeleireira"
      descricao="Especialista em cabelos cacheados"
    />
    <ExampleCard nome="Ana Beatriz" cargo="Manicure" descricao="Unhas gel e nail art" />
    <ExampleCard nome="Camila Souza" cargo="Maquiagem" descricao="Social e festas" />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
