"use strict";
const products = [
  {
    id: "cup",
    name: "Caneca de cerâmica",
    category: "Uma pausa",
    description: "Seu café com mais calma.",
    cents: 3990,
    color: "#f0ebe2",
    art: '<path d="M30 38h50v43c0 20-50 20-50 0z" fill="#e0d2b8"/><path d="M80 46h10c22 0 18 30-10 28" fill="none" stroke="#c6b797" stroke-width="8"/><ellipse cx="55" cy="38" rx="25" ry="7" fill="#8a6e4a"/>',
  },
  {
    id: "bottle",
    name: "Garrafa térmica",
    category: "Em movimento",
    description: "Sua companhia o dia inteiro.",
    cents: 8990,
    color: "#e6ede5",
    art: '<rect x="46" y="17" width="28" height="15" rx="4" fill="#334039"/><rect x="40" y="30" width="40" height="76" rx="15" fill="#6d927c"/><path d="M48 44v44" stroke="#97b59b" stroke-width="4" stroke-linecap="round"/>',
  },
  {
    id: "notebook",
    name: "Caderno de ideias",
    category: "Para criar",
    description: "Espaço para novos começos.",
    cents: 2490,
    color: "#f3e8dc",
    art: '<rect x="30" y="22" width="62" height="80" rx="5" fill="#bc8c60"/><path d="M40 22v80M81 22v80" stroke="#8d613f" stroke-width="3"/><path d="M51 45h19M51 51h12" stroke="#edd9b9" stroke-width="2"/>',
  },
  {
    id: "headphones",
    name: "Fone sem fio",
    category: "No seu ritmo",
    description: "Uma trilha para cada momento.",
    cents: 15990,
    color: "#e8ebee",
    art: '<path d="M27 70V53c0-47 66-47 66 0v17" fill="none" stroke="#3e4846" stroke-width="12"/><rect x="20" y="57" width="24" height="35" rx="10" fill="#586461"/><rect x="76" y="57" width="24" height="35" rx="10" fill="#586461"/>',
  },
  {
    id: "bag",
    name: "Ecobag de algodão",
    category: "Leve com você",
    description: "Prática e reutilizável.",
    cents: 4990,
    color: "#eeeddf",
    art: '<path d="M31 43h58l8 61H23z" fill="#d6bd89"/><path d="M44 46V31c0-25 32-25 32 0v15" fill="none" stroke="#b49b6d" stroke-width="5"/><path d="M51 64h18v18H51z" fill="#647b53"/>',
  },
];
const cart = new Map();
const el = (id) => document.getElementById(id);
const money = (cents) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const total = () =>
  products.reduce((sum, p) => sum + p.cents * (cart.get(p.id) || 0), 0);
let busy = false;
el("products").innerHTML = products
  .map(
    (p) =>
      `<article><div class="art" style="--bg:${p.color}"><svg viewBox="0 0 120 120" aria-hidden="true">${p.art}</svg></div><small>${p.category}</small><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><strong>${money(p.cents)}</strong><button type="button" data-add="${p.id}" aria-label="Adicionar ${p.name}">+ Adicionar</button></div></article>`,
  )
  .join("");
function render() {
  const count = [...cart.values()].reduce((sum, n) => sum + n, 0);
  el("count").textContent = count;
  el("total").textContent = money(total());
  el("points").textContent = Math.floor(total() / 1000) + " pontos";
  el("submit").disabled = !count || busy;
  el("clear").disabled = !count || busy;
  el("items").innerHTML = count
    ? products
        .filter((p) => cart.has(p.id))
        .map(
          (p) =>
            `<div class="item"><div><strong>${p.name}</strong><button type="button" class="remove" data-remove="${p.id}" aria-label="Remover ${p.name}">×</button></div><div><span class="quantity"><button type="button" data-minus="${p.id}" aria-label="Diminuir quantidade de ${p.name}">−</button><span>${cart.get(p.id)}</span><button type="button" data-add="${p.id}" aria-label="Aumentar quantidade de ${p.name}">+</button></span><strong>${money(p.cents * cart.get(p.id))}</strong></div></div>`,
        )
        .join("")
    : '<div class="empty">Sua sacola está esperando.<br>Adicione um produto para começar.</div>';
  document
    .querySelectorAll("[data-add],[data-minus],[data-remove]")
    .forEach((button) => {
      button.disabled = busy;
    });
}
document.addEventListener("click", (event) => {
  if (busy) return;
  const button = event.target.closest("button");
  if (!button) return;
  const id =
    button.dataset.add || button.dataset.minus || button.dataset.remove;
  if (!products.some((p) => p.id === id)) return;
  const quantity = (cart.get(id) || 0) + (button.dataset.add ? 1 : -1);
  if (button.dataset.remove || quantity <= 0) cart.delete(id);
  else cart.set(id, quantity);
  el("feedback").hidden = true;
  render();
});
el("clear").addEventListener("click", () => {
  if (busy) return;
  cart.clear();
  el("feedback").hidden = true;
  render();
});
el("mode").addEventListener("change", () => {
  const real = el("mode").value === "api";
  el("user-field").hidden = !real;
  el("user").required = real;
  el("submit").textContent = real ? "Enviar pedido →" : "Simular compra →";
  el("note").textContent = real
    ? "Esta opção grava o pedido e envia para processamento de pontos. Nenhum pagamento é cobrado."
    : "Simulação sem cobrança ou gravação de pedido.";
  el("feedback").hidden = true;
});
function feedback(message, error = false) {
  el("feedback").textContent = message;
  el("feedback").className = error ? "error" : "";
  el("feedback").hidden = false;
  el("feedback").focus();
}
el("checkout").addEventListener("submit", async (event) => {
  event.preventDefault();
  const cents = total();
  if (!cents || busy) return;
  const points = Math.floor(cents / 1000);
  if (el("mode").value === "demo") {
    cart.clear();
    render();
    feedback(
      `Compra simulada com sucesso! Total: ${money(cents)}. Previsão: ${points} pontos. Nenhum pedido foi gravado ou pagamento cobrado.`,
    );
    return;
  }
  const user = Number(el("user").value);
  if (!Number.isSafeInteger(user) || user <= 0) {
    feedback("Informe um ID de usuário inteiro e positivo.", true);
    return;
  }
  busy = true;
  el("mode").disabled = el("user").disabled = true;
  el("submit").textContent = "Enviando pedido…";
  render();
  try {
    const response = await fetch("./pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: user, valor_total: cents / 100 }),
    });
    if (!response.ok)
      throw new Error(
        `A API respondeu com erro ${response.status}. Verifique se o pedido foi gravado antes de reenviar.`,
      );
    const data = await response.json();
    if (data.pedido_id == null)
      throw new Error(
        "Resposta sem ID do pedido. Verifique o registro antes de reenviar.",
      );
    cart.clear();
    feedback(
      `Pedido ${data.pedido_id} criado! Total: ${money(cents)}. Previsão de ${points} pontos, processados de forma assíncrona pelo worker.`,
    );
  } catch (error) {
    feedback(
      error instanceof TypeError
        ? "Não foi possível confirmar o envio. Verifique a conexão e os pedidos no servidor antes de tentar novamente."
        : error.message || "Não foi possível confirmar o pedido.",
      true,
    );
  } finally {
    busy = false;
    el("mode").disabled = el("user").disabled = false;
    el("submit").textContent = "Enviar pedido →";
    render();
  }
});
render();
