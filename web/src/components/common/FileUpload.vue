<template>
  <div class="file-upload">
    <input 
      type="file" 
      @change="handleFileUpload" 
      accept="image/*" 
      :disabled="isUploading"
    />
    <button 
      @click="uploadFile" 
      :disabled="!file || isUploading"
      :class="{ 'uploading': isUploading }"
    >
      {{ isUploading ? `Enviando... ${Math.round(uploadProgress)}%` : 'Upload' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import storageService from '@/api/storage/StorageService.js';

const file = ref(null);
const error = ref('');
const isUploading = ref(false);
const uploadProgress = ref(0);

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
  error.value = '';
};

const uploadFile = async () => {
  if (!file.value) return;

  try {
    isUploading.value = true;
    error.value = '';
    uploadProgress.value = 0;

    const result = await storageService.uploadFile(file.value);
    emit('upload-complete', result);
  } catch (err) {
    error.value = err.message;
  } finally {
    isUploading.value = false;
  }
};

const emit = defineEmits(['upload-complete']);
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input[type="file"] {
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
}

button {
  padding: 0.5rem 1rem;
  background-color: #520;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button.uploading {
  background-color: #6c757d;
}

.error {
  color: #dc3545;
  margin: 0;
  font-size: 0.9rem;
}
</style> 