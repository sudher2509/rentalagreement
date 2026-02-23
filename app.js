const state = {
  contracts: [],
  payments: [],
  ratings: [],
};

const els = {
  contractForm: document.getElementById('contract-form'),
  tenantName: document.getElementById('tenant-name'),
  propertyAddress: document.getElementById('property-address'),
  monthlyRent: document.getElementById('monthly-rent'),
  startDate: document.getElementById('start-date'),
  contractsList: document.getElementById('contracts-list'),

  paymentForm: document.getElementById('payment-form'),
  contractSelect: document.getElementById('contract-select'),
  paymentMonth: document.getElementById('payment-month'),
  paymentAmount: document.getElementById('payment-amount'),
  paymentsList: document.getElementById('payments-list'),

  ratingForm: document.getElementById('rating-form'),
  ratingTenant: document.getElementById('rating-tenant'),
  ratingScore: document.getElementById('rating-score'),
  ratingNotes: document.getElementById('rating-notes'),
  ratingsList: document.getElementById('ratings-list'),
};

const uid = () => crypto.randomUUID();

function renderContracts() {
  els.contractsList.innerHTML = state.contracts
    .map(
      (contract) => `
      <li>
        <strong>${contract.tenant}</strong> — ${contract.address}
        <div class="meta">Rent: $${contract.rent}/month · Starts: ${contract.startDate}</div>
      </li>
    `,
    )
    .join('');

  const options = state.contracts
    .map((contract) => `<option value="${contract.id}">${contract.tenant}</option>`)
    .join('');

  els.contractSelect.innerHTML = '<option value="">Choose a tenant</option>' + options;
  els.ratingTenant.innerHTML = '<option value="">Choose a tenant</option>' + options;
}

function renderPayments() {
  els.paymentsList.innerHTML = state.payments
    .map((payment) => {
      const contract = state.contracts.find((c) => c.id === payment.contractId);
      if (!contract) return '';
      return `
        <li class="payment">
          <strong>${contract.tenant}</strong> paid <strong>$${payment.amount}</strong>
          <div class="meta">Month: ${payment.month}</div>
        </li>
      `;
    })
    .join('');
}

function renderRatings() {
  els.ratingsList.innerHTML = state.ratings
    .map((rating) => {
      const contract = state.contracts.find((c) => c.id === rating.contractId);
      if (!contract) return '';
      return `
        <li>
          <strong>${contract.tenant}</strong> · Rating: ${'⭐'.repeat(rating.score)}
          <div class="meta">${rating.notes || 'No notes provided.'}</div>
        </li>
      `;
    })
    .join('');
}

els.contractForm.addEventListener('submit', (event) => {
  event.preventDefault();

  state.contracts.push({
    id: uid(),
    tenant: els.tenantName.value.trim(),
    address: els.propertyAddress.value.trim(),
    rent: Number(els.monthlyRent.value),
    startDate: els.startDate.value,
  });

  els.contractForm.reset();
  renderContracts();
});

els.paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  state.payments.unshift({
    contractId: els.contractSelect.value,
    month: els.paymentMonth.value,
    amount: Number(els.paymentAmount.value),
  });

  els.paymentForm.reset();
  renderPayments();
});

els.ratingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  state.ratings.unshift({
    contractId: els.ratingTenant.value,
    score: Number(els.ratingScore.value),
    notes: els.ratingNotes.value.trim(),
  });

  els.ratingForm.reset();
  renderRatings();
});

renderContracts();
renderPayments();
renderRatings();
