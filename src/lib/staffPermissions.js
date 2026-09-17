export const STAFF_PERMISSIONS = {
  dashboardView: 'dashboard.view',
  productsView: 'products.view',
  productsCreate: 'products.create',
  productsUpdate: 'products.update',
  productsDelete: 'products.delete',
  inventoryView: 'inventory.view',
  inventoryManage: 'inventory.manage',
  ordersView: 'orders.view',
  ordersUpdate: 'orders.update',
  customersView: 'customers.view',
  analyticsView: 'analytics.view',
  transactionsView: 'transactions.view',
  financeView: 'finance.view',
  payoutView: 'payout.view',
  payoutManage: 'payout.manage',
  storeManage: 'store.manage',
  domainsManage: 'domains.manage',
  subscriptionManage: 'subscription.manage',
  staffView: 'staff.view',
  staffManage: 'staff.manage',
  securityManage: 'security.manage',
  storeDelete: 'store.delete',
  ownershipTransfer: 'ownership.transfer'
};

export const SYSTEM_ROLE_DEFINITIONS = [
  { name: 'Store Manager', description: 'Manage day-to-day store operations.', permissions: ['dashboard.view', 'products.view', 'products.create', 'products.update', 'inventory.view', 'inventory.manage', 'orders.view', 'orders.update', 'customers.view', 'analytics.view', 'transactions.view', 'store.manage'] },
  { name: 'Order / Operations Staff', description: 'Process orders, inventory, and fulfillment.', permissions: ['dashboard.view', 'orders.view', 'orders.update', 'inventory.view', 'inventory.manage', 'customers.view'] },
  { name: 'Product Staff', description: 'Manage products, categories, and inventory.', permissions: ['dashboard.view', 'products.view', 'products.create', 'products.update', 'products.delete', 'inventory.view', 'inventory.manage'] },
  { name: 'Customer Support', description: 'Support customers and monitor order status.', permissions: ['dashboard.view', 'customers.view', 'orders.view'] },
  { name: 'Accountant / Finance', description: 'View sales and financial reporting.', permissions: ['dashboard.view', 'analytics.view', 'transactions.view', 'finance.view'] }
];

export const PERMISSION_GROUPS = [
  { label: 'Dashboard', permissions: ['dashboard.view'] },
  { label: 'Products', permissions: ['products.view', 'products.create', 'products.update', 'products.delete'] },
  { label: 'Inventory', permissions: ['inventory.view', 'inventory.manage'] },
  { label: 'Orders', permissions: ['orders.view', 'orders.update'] },
  { label: 'Customers', permissions: ['customers.view'] },
  { label: 'Finance', permissions: ['transactions.view', 'finance.view'] },
  { label: 'Store', permissions: ['store.manage', 'domains.manage'] },
  { label: 'Staff', permissions: ['staff.view', 'staff.manage'] },
  { label: 'Security', permissions: ['security.manage'] }
];
