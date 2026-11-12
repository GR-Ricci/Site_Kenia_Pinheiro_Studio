<script setup>
import CategoryService from '@/components/pages/profile-buttons/CategoryService.vue'
import GalleryEditor from '@/components/pages/profile-buttons/GalleryEditor.vue'
import Staff from '@/components/pages/profile-buttons/Staff.vue'
import CarouselEditor from '@/components/pages/profile-buttons/CarouselEditor.vue'
import EditContact from '@/components/pages/profile-buttons/EditAbout.vue'
import EditHours from '@/components/pages/profile-buttons/EditHours.vue'
import EditWallpaper from '@/components/pages/profile-buttons/EditWallpaper.vue'

import { useJwtStore } from '@/stores/jwt'
import { ref } from 'vue'
const jwtStore = useJwtStore()

const abrirCadastro = ref(false)
const abrirGaleria = ref(false)
const abrirFuncionarios = ref(false)
const editarCarrossel = ref(false)
const editarContato = ref(false)
const editarHorario = ref(false)
const abrirEditorWallpaper = ref(false)
</script>

<template>
  <section v-if="jwtStore.tipo === 'ADMIN'" class="profile__admin__options">
    <button @click="abrirCadastro = true" class="profile__button">Categorias e Serviços</button>
    <button @click="abrirFuncionarios = true" class="profile__button">Funcionários</button>
    <button @click="editarHorario = true" class="profile__button">Horários</button>
    <button @click="editarContato = true" class="profile__button">Contato</button>
  </section>

  <section v-if="jwtStore.tipo === 'ADMIN'" class="profile__admin__options">
    <button @click="editarCarrossel = true" class="profile__button">Carrossel</button>
    <button @click="abrirGaleria = true" class="profile__button">Galeria</button>
    <button @click="editarCarrossel = true" class="profile__button">Carrossel</button>
    <button @click="abrirEditorWallpaper = true" class="profile__button">Imagem Início</button>
  </section>

  <CategoryService :abrir-cadastro="abrirCadastro" @fechar="abrirCadastro = false" />
  <GalleryEditor :abrir-galeria="abrirGaleria" @fechar="abrirGaleria = false" />
  <Staff :abrir-funcionarios="abrirFuncionarios" @fechar="abrirFuncionarios = false" />
  <CarouselEditor :editar-carrossel="editarCarrossel" @fechar="editarCarrossel = false" />
  <EditContact :editar-contato="editarContato" @fechar="editarContato = false" />
  <EditHours :editar-horario="editarHorario" @fechar="editarHorario = false" />
  <EditWallpaper :abrir-editor-wallpaper="abrirEditorWallpaper" @close="abrirEditorWallpaper = false" />
</template>

<style scoped></style>
