// script.js (arquivo em módulo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getFirestore, collection, doc, setDoc, onSnapshot, runTransaction, getDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyB9gTaojRXu7J7g7yI7Hw_9lb3yDMr1ydg",
  authDomain: "cha-de-casa-nova-9034c.firebaseapp.com",
  projectId: "cha-de-casa-nova-9034c",
  storageBucket: "cha-de-casa-nova-9034c.firebasestorage.app",
  messagingSenderId: "396610857130",
  appId: "1:396610857130:web:14590d41081486e57048d3",
  measurementId: "G-Y8GJQB19PR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const presentesColl = collection(db, "presentes");

// Itens padrão
const defaultItems = [
  { id: "pratos", name: "Conjunto de pratos", buyer: "", bought: false },
  { id: "copos", name: "Jogo de copos", buyer: "", bought: false },
  { id: "frigideira", name: "Frigideira antiaderente", buyer: "", bought: false },
  { id: "toalhas", name: "Toalhas de banho", buyer: "", bought: false },
  { id: "panos", name: "Panos de prato", buyer: "", bought: false }
];

// Elementos do DOM
const listaEl = document.getElementById("lista-presentes");
const statusEl = document.getElementById("status");

// Inicializa itens padrão se a coleção estiver vazia
async function ensureDefaultItems() {
  const anyDoc = await getDoc(doc(db, "presentes", defaultItems[0].id));
  if(!anyDoc.exists()){
    for(const it of defaultItems){
      await setDoc(doc(presentesColl, it.id), it);
    }
  }
}

// Cria a div de informação do presente
function createInfoDiv(item){
  const info = document.createElement("div");
  info.className = "present-info";

  const name = document.createElement("div");
  name.className = "present-item-name";
  name.textContent = item.name;

  const meta = document.createElement("div");
  meta.className = "present-item-meta";
  meta.textContent = item.bought ? `Comprado por: ${item.buyer}` : "Disponível";

  info.appendChild(name);
  info.appendChild(meta);
  return info;
}

// Cria botão de ação do presente
function createActionButton(item){
  const btn = document.createElement("button");
  btn.className = "btn";
  
  if(item.bought){
    btn.textContent = `Comprado ✔`;
    btn.classList.add("secondary");
    btn.disabled = true;
  } else {
    btn.textContent = "Marcar como comprado";
    btn.addEventListener("click", async () => {
      const nome = prompt("Digite seu nome para marcar este presente como comprado:");
      if(!nome) return;
      const docRef = doc(db, "presentes", item.id);
      try {
        await runTransaction(db, async (t) => {
          const d = await t.get(docRef);
          if(!d.exists()) throw "Documento não existe";
          const data = d.data();
          if(data.bought) throw "Já comprado";
          t.update(docRef, { bought: true, buyer: nome });
        });
      } catch (err) {
        alert(typeof err === "string" ? err : "Falha ao marcar. Tente de novo.");
      }
    });
  }
  return btn;
}

// Cria botão de remover (para admin/teste)
function createRemoveButton(item){
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remover ❌";
  removeBtn.className = "btn remove";
  removeBtn.addEventListener("click", async () => {
    if(confirm(`Remover ${item.name}?`)){
      await deleteDoc(doc(db, "presentes", item.id));
    }
  });
  return removeBtn;
}

// Renderiza um item na lista
function renderItem(item){
  const li = document.createElement("li");
  li.dataset.id = item.id;
  li.classList.add(item.bought ? "bought" : "available");

  li.appendChild(createInfoDiv(item));
  li.appendChild(createActionButton(item));
  li.appendChild(createRemoveButton(item));

  return li;
}

// Observa coleção em tempo real
function startRealtime(){
  onSnapshot(presentesColl, (snap) => {
    listaEl.innerHTML = "";
    const items = [];
    snap.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));
    // Ordena: disponíveis primeiro
    items.sort((a,b) => a.bought - b.bought);
    items.forEach(item => listaEl.appendChild(renderItem(item)));
    statusEl.textContent = "Atualizado em tempo real ✅";
  }, (err) => {
    statusEl.textContent = "Erro na conexão: " + err.message;
  });
}

// Inicialização
(async function init(){
  statusEl.textContent = "Verificando dados... ⏳";
  try{
    await ensureDefaultItems();
    startRealtime();
  }catch(e){
    statusEl.textContent = "Erro: " + (e.message || e);
  }
})();
