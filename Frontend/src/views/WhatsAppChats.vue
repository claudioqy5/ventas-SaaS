<template>
  <div class="whatsapp-layout" v-if="empresaId">
    <!-- Panel Izquierdo: Lista de Chats -->
    <div class="sidebar-chats">
      <div class="sidebar-header">
        <h2 class="header-title">Chats IA (Valentina)</h2>
        <div class="actions">
          <button @click="loadChats" class="btn-refresh" title="Actualizar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </button>
        </div>
      </div>
      
      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="searchQuery" placeholder="Buscar un chat o contacto..." class="search-input" />
        </div>
      </div>

      <div class="chat-list" v-if="filteredChats.length > 0">
        <div 
          v-for="chat in filteredChats" 
          :key="chat.id" 
          class="chat-item" 
          :class="{ active: selectedChat?.id === chat.id }"
          @click="selectChat(chat)"
        >
          <div class="avatar">
            <div class="avatar-circle">
              {{ (chat.nombreCliente || chat.whatsAppCliente).charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="chat-info">
            <div class="chat-info-top">
              <span class="contact-name">{{ chat.nombreCliente || chat.whatsAppCliente }}</span>
              <span class="last-time">{{ formatTime(chat.ultimoMensajeFecha) }}</span>
            </div>
            <div class="chat-info-bottom">
              <span class="last-message">
                {{ getLastMessagePreview(chat) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="empty-state-sidebar" v-else>
        <span v-if="loading">Cargando chats...</span>
        <span v-else>No hay chats recientes</span>
      </div>
    </div>

    <!-- Panel Derecho: Hilo de Conversación -->
    <div class="main-chat">
      <!-- Chat Header -->
      <div class="chat-header" v-if="selectedChat">
        <div class="avatar">
          <div class="avatar-circle">
            {{ (selectedChat.nombreCliente || selectedChat.whatsAppCliente).charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="contact-details">
          <h3 class="contact-name-header">{{ selectedChat.nombreCliente || selectedChat.whatsAppCliente }}</h3>
          <span class="contact-phone">{{ selectedChat.whatsAppCliente }}</span>
        </div>
      </div>

      <!-- Área de mensajes -->
      <div class="messages-area" ref="messagesArea" v-if="selectedChat">
        <div class="date-divider" v-if="selectedChat.mensajes && selectedChat.mensajes.length > 0">
          <span>Últimos mensajes sincronizados</span>
        </div>
        
        <div 
          v-for="(msg, index) in selectedChat.mensajes" 
          :key="index"
          class="message-wrapper"
          :class="{ 'message-out': msg.emisor !== 'Cliente', 'message-in': msg.emisor === 'Cliente' }"
        >
          <div class="message-bubble">
            <div class="message-text">{{ msg.texto }}</div>
            <div class="message-meta">
              <span class="message-time">{{ formatTime(msg.fecha) }}</span>
              <span class="message-sender" v-if="msg.emisor !== 'Cliente' && msg.emisor !== 'Bot'">{{ msg.emisor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío (Sin seleccionar) -->
      <div class="empty-state-main" v-else>
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h2>Chats de Inteligencia Artificial</h2>
        <p>Selecciona una conversación a la izquierda para supervisar la atención de Valentina.</p>
        <p class="hint-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Modo Solo Lectura - El bot gestiona las respuestas</p>
      </div>
      
      <!-- Área de Input (Desactivada en modo lectura) -->
      <div class="chat-input-area" v-if="selectedChat">
        <div class="input-readonly">
          <p>Esta conversación está siendo gestionada por la IA Valentina. (Modo solo lectura)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../stores/auth';
import { API_URL } from '../config';

const authStore = useAuthStore();
const empresaId = computed(() => authStore.user?.empresaId);

const chats = ref([]);
const loading = ref(true);
const selectedChat = ref(null);
const searchQuery = ref('');
const messagesArea = ref(null);

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value;
  const q = searchQuery.value.toLowerCase();
  return chats.value.filter(c => 
    c.nombreCliente.toLowerCase().includes(q) || 
    c.whatsAppCliente.toLowerCase().includes(q)
  );
});

const loadChats = async () => {
  if (!empresaId.value) return;
  
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/api/whatsapp-chats/${empresaId.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    if (response.ok) {
      chats.value = await response.json();
      
      // Update selected chat if already open
      if (selectedChat.value) {
        const updatedSelected = chats.value.find(c => c.id === selectedChat.value.id);
        if (updatedSelected) {
          selectedChat.value = updatedSelected;
          scrollToBottom();
        }
      }
    }
  } catch (error) {
    console.error("Error al cargar chats:", error);
  } finally {
    loading.value = false;
  }
};

const selectChat = (chat) => {
  selectedChat.value = chat;
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesArea.value) {
      messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
    }
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  // Si es hoy, mostrar hora
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
  // Si fue ayer
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  }
  // Otro dia
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getLastMessagePreview = (chat) => {
  if (!chat.mensajes || chat.mensajes.length === 0) return 'Sin mensajes';
  const lastMsg = chat.mensajes[chat.mensajes.length - 1];
  
  const prefix = lastMsg.emisor === 'Bot' ? 'IA: ' : '';
  const text = lastMsg.texto || '';
  
  return prefix + (text.length > 40 ? text.substring(0, 40) + '...' : text);
};

onMounted(() => {
  if (empresaId.value) {
    loadChats();
  }
});
</script>

<style scoped>
.whatsapp-layout {
  display: flex;
  height: calc(100vh - 60px); /* Ajustar según header */
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: -10px; /* Para alinear un poco arriba según tu layout general */
}

/* SIDEBAR IZQUIERDO */
.sidebar-chats {
  width: 380px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.sidebar-header {
  height: 60px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e2e8f0;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.btn-refresh {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.search-bar {
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.search-input-wrapper {
  background: #f0f2f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
}

.search-icon {
  color: #64748b;
  margin-right: 12px;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #334155;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  padding: 0 12px;
  height: 72px;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-item:hover {
  background: #f8fafc;
}

.chat-item.active {
  background: #f0f2f5;
}

.avatar {
  margin-right: 12px;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #cbd5e1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.chat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #f1f5f9;
  height: 100%;
  padding-right: 4px;
}

.chat-item:last-child .chat-info {
  border-bottom: none;
}

.chat-info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.contact-name {
  font-weight: 500;
  color: #0f172a;
  font-size: 15px;
}

.last-time {
  font-size: 12px;
  color: #64748b;
}

.chat-info-bottom {
  display: flex;
}

.last-message {
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.empty-state-sidebar {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

/* MAIN CHAT AREA */
.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #efeae2; /* Color de fondo tipo WhatsApp */
  position: relative;
}

/* Background pattern */
.main-chat::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  opacity: 0.06;
  z-index: 0;
  pointer-events: none;
}

.chat-header {
  height: 60px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #e2e8f0;
  z-index: 1;
}

.chat-header .avatar-circle {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-name-header {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.contact-phone {
  font-size: 12px;
  color: #64748b;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 60px;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.date-divider {
  text-align: center;
  margin: 10px 0 20px;
}

.date-divider span {
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #475569;
  box-shadow: 0 1px 0.5px rgba(11,20,26,.13);
}

.message-wrapper {
  display: flex;
  margin-bottom: 12px;
  width: 100%;
}

.message-in {
  justify-content: flex-start;
}

.message-out {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 65%;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 1px 0.5px rgba(11,20,26,.13);
}

.message-in .message-bubble {
  background: #ffffff;
  border-top-left-radius: 0;
}

.message-out .message-bubble {
  background: #d9fdd3; /* Verde clarito WhatsApp */
  border-top-right-radius: 0;
}

/* Colitas del globo (tails) */
.message-in .message-bubble::before {
  content: "";
  position: absolute;
  top: 0;
  left: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 10px 0;
  border-color: transparent #ffffff transparent transparent;
}

.message-out .message-bubble::after {
  content: "";
  position: absolute;
  top: 0;
  right: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 10px 8px;
  border-color: transparent transparent transparent #d9fdd3;
}

.message-text {
  font-size: 14px;
  color: #111b21;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 4px;
  gap: 6px;
}

.message-time {
  font-size: 11px;
  color: #667781;
}

.message-sender {
  font-size: 10px;
  font-weight: 600;
  background: #e2e8f0;
  color: #475569;
  padding: 2px 4px;
  border-radius: 4px;
}

.empty-state-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  color: #475569;
  z-index: 1;
  text-align: center;
  padding: 0 20px;
}

.empty-illustration {
  margin-bottom: 24px;
  width: 120px;
  height: 120px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-main h2 {
  font-size: 24px;
  font-weight: 300;
  color: #334155;
  margin-bottom: 12px;
}

.hint-text {
  margin-top: 24px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.chat-input-area {
  height: 60px;
  background: #f0f2f5;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  z-index: 1;
}

.input-readonly {
  flex: 1;
  background: #ffffff;
  border-radius: 8px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 13px;
  font-style: italic;
  box-shadow: 0 1px 0.5px rgba(11,20,26,.13);
}

.input-readonly p {
  margin: 0;
}
</style>
