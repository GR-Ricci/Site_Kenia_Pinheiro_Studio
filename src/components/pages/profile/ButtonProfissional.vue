<script setup>
import Subservice from '@/components/pages/profile-buttons/Subservice.vue'
import EditSubservice from '@/components/pages/profile-buttons/EditSubservice.vue'
import PackageEditor from '@/components/pages/profile-buttons/PackageEditor.vue'
import { ref } from 'vue'
const abrirSubservico = ref(false)
const editarSubservico = ref(false)
const abrirPacotes = ref(false)
</script>

<template>
  <section class="profile__options">
    <button @click="abrirSubservico = true" class="profile__button">Subserviço</button>
    <button @click="editarSubservico = true" class="profile__button">Editar - Subserviço</button>
    <button @click="abrirPacotes = true" class="profile__button">pacotes</button>

    <!-- button class="profile__button" type="button">Cadastrar horários</button -->
  </section>

  <Subservice :abrir-subservico="abrirSubservico" @fechar="abrirSubservico = false" />
  <EditSubservice :editar-subservico="editarSubservico" @fechar="editarSubservico = false" />
  <PackageEditor :abrirPacotes="abrirPacotes" @fechar="abrirPacotes = false" />
</template>

<style scoped></style>
