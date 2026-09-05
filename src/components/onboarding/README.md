# Onboarding Modal Components

This directory contains dedicated modal components for the Unbley onboarding flow. These modals provide focused, step-by-step interfaces for new store owners to complete their store setup.

## Components Overview

### 1. **PaymentSetupModal** (`PaymentSetupModal.jsx`)
Handles payment wallet setup for receiving payments from customers.

**Features:**
- Bank account information collection (bank name, account number, account name)
- Phone number input for payment verification
- Support for multiple Nigerian banks
- Secure data handling with Supabase
- Real-time validation

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Called when modal is closed
- `onComplete` (function): Called when payment setup is successful

---

### 2. **StoreInfoModal** (`StoreInfoModal.jsx`)
Complete store branding and information setup.

**Features:**
- Store logo upload with image validation
- Brand name and owner name fields
- Email address configuration
- Brand category selection (10+ categories)
- Color scheme setup (primary, secondary, accent)
- Profile completion flag
- Image optimization and storage

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Called when modal is closed
- `onComplete` (function): Called when store info is saved

**Supported Categories:**
- Fashion & Apparel
- Beauty & Cosmetics
- Electronics
- Home & Garden
- Food & Beverage
- Books & Media
- Sports & Outdoors
- Toys & Games
- Services
- Other

---

### 3. **ShippingModal** (`ShippingModal.jsx`)
Setup shipping and delivery options for the store.

**Features:**
- Predefined delivery time options (1-2 days, 2-3 days, etc.)
- Custom delivery duration support
- Shipping methods visualization
- Clear delivery information for customers
- Best practice tips

**Delivery Options:**
- 1-2 days (Express)
- 2-3 days (Standard)
- 3-5 days (Regular)
- 5-7 days (Economy)
- 7-14 days (International)
- Custom (user-defined)

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Called when modal is closed
- `onComplete` (function): Called when shipping is saved

---

### 4. **ProductsModal** (`ProductsModal.jsx`)
Add the first product to the store with a 2-step process.

**Features:**
- Step 1: Quick add (product name and price)
- Step 2: Detailed info (image and description)
- Image upload with validation
- Price input with currency
- Multi-step progress indicator
- Product status management

**Step Flow:**
1. Basic Information (name & price)
2. Enhanced Details (image & description)

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Called when modal is closed
- `onComplete` (function): Called when product is added

---

### 5. **SubscriptionPlanModal** (`SubscriptionPlanModal.jsx`)
Display and manage subscription plan selection.

**Features:**
- 3 pricing tiers (Basic, Professional, Enterprise)
- 30-60% first-year discount display
- Feature comparison per plan
- Popular plan highlighting
- Plan activation and payment simulation
- Skip option available

**Plans:**

| Plan | First Year Price | Original Price | Discount | Features |
|------|------------------|------------------|----------|----------|
| Basic | $49 | $99 | 50% | 10 products, Email support |
| Professional | $99 | $199 | 50% | 100 products, Chat support, Analytics |
| Enterprise | $199 | $499 | 60% | Unlimited, API, Account manager |

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Called when modal is closed
- `onComplete` (function): Called when plan is activated

---

## Integration with OnboardingModal

These modals are integrated into the main `OnboardingModal.jsx` component:

```javascript
// The main onboarding modal displays 5 steps
const steps = [
  { id: 'wallet', action: () => setActiveModal('payment') },
  { id: 'store_info', action: () => setActiveModal('store_info') },
  { id: 'shipping', action: () => setActiveModal('shipping') },
  { id: 'products', action: () => setActiveModal('products') },
  { id: 'subscription', action: () => setActiveModal('subscription') }
];
```

When a user clicks a step, the corresponding modal opens for focused setup.

---

## Styling & Design

All modals follow Unbley's design system:

**Colors:**
- Primary: `#6A3E1F` (Brown)
- Secondary: `#FFFFFF` (White)
- Accent: `#10B981` (Green)
- Text: `#111827` (Dark Gray)
- Borders: `#E5E7EB` (Light Gray)

**Components:**
- Framer Motion for animations
- Smooth transitions and hover effects
- Modal portaling to document.body
- Responsive grid layouts

---

## Database Integration

All modals integrate with Supabase:

**Tables Used:**
- `brand_profiles` - Stores brand and store information
- `products` - Stores product data
- `brand-assets` - Storage bucket for images (logos, products)

**Row-Level Security (RLS):**
- Users can only modify their own data
- All queries filtered by `auth.uid()`

---

## Usage Example

```jsx
import OnboardingModal from './components/OnboardingModal';

export default function Dashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        storeData={profileData}
        storeId={user.id}
      />
    </>
  );
}
```

---

## Features & Best Practices

✅ **Input Validation:** All fields are validated before submission
✅ **Error Handling:** User-friendly error messages
✅ **Loading States:** Clear feedback during processing
✅ **Image Optimization:** File size and type validation
✅ **Security:** Secure data transmission via Supabase
✅ **Accessibility:** Proper labels and ARIA attributes
✅ **Responsive:** Works on mobile and desktop
✅ **User Guidance:** Helpful tips and best practices included

---

## File Structure

```
src/components/onboarding/
├── PaymentSetupModal.jsx
├── StoreInfoModal.jsx
├── ShippingModal.jsx
├── ProductsModal.jsx
└── SubscriptionPlanModal.jsx
```

Modified files:
- `src/components/OnboardingModal.jsx` - Integrated all new modals

---

## Future Enhancements

- Payment gateway integration (Paystack, Flutterwave)
- Batch product import
- Shipping rate calculator
- Plan upgrade/downgrade flow
- Email verification for payment accounts
- Dynamic pricing based on currency
