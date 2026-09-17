export const getEffectivePermissions = ({ userId, storeId, ownerId, member }) => {
  if (userId === ownerId && storeId === ownerId) return ['*'];
  if (!member || member.store_id !== storeId || member.status !== 'active') return [];
  return Array.isArray(member.store_roles?.permissions) ? member.store_roles.permissions : [];
};

export const hasPermission = (permissions, permission) => permissions.includes('*') || permissions.includes(permission);

export const requirePermission = async ({ supabase, userId, storeId, permission }) => {
  const { data: store } = await supabase.from('brand_profiles').select('id').eq('id', storeId).maybeSingle();
  if (!store) return { ok: false, status: 404, error: 'Store not found.' };
  const { data: member } = await supabase.from('store_members').select('store_id, status, store_roles(permissions)').eq('store_id', storeId).eq('user_id', userId).maybeSingle();
  const permissions = getEffectivePermissions({ userId, storeId, ownerId: storeId, member });
  if (!hasPermission(permissions, permission)) return { ok: false, status: 403, error: 'You do not have permission to perform this action.' };
  return { ok: true, permissions, member };
};
