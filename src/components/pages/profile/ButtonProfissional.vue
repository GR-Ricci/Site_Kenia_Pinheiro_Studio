<script setup>
import Subservice from '@/components/pages/profile-buttons/Subservice.vue'
import EditSubservice from '@/components/pages/profile-buttons/EditSubservice.vue'
import { ref } from 'vue'
const abrirSubservico = ref(false)
const editarSubservico = ref(false)
</script>

<template>
  <section class="profile__options">
    <button @click="abrirSubservico = true" class="profile__button">Subserviço</button>
    <button @click="editarSubservico = true" class="profile__button">Editar - Subserviço</button>

    <!-- button class="profile__button" type="button">Cadastrar horários</button -->
  </section>

  <Subservice :abrir-subservico="abrirSubservico" @fechar="abrirSubservico = false" />
  <EditSubservice :editar-subservico="editarSubservico" @fechar="editarSubservico = false" />
</template>

<style scoped></style>
