import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { label: 'Cart', path: '/cart' },
  { label: 'Details', path: '/checkout' },
  { label: 'Complete', path: '/checkout-success' }
];

export default function CheckoutProgress({ currentStep = 0 }) {
  const navigate = useNavigate();
  const activeStep = Math.max(0, Math.min(currentStep, steps.length - 1));

  return (
    <nav className="checkout-progress" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const isComplete = index < activeStep;
        const isCurrent = index === activeStep;
        const canNavigate = index < activeStep;

        return (
          <React.Fragment key={step.label}>
            <button
              type="button"
              className={`checkout-progress-step${isCurrent ? ' is-current' : ''}${isComplete ? ' is-complete' : ''}`}
              onClick={() => canNavigate && navigate(step.path)}
              disabled={!canNavigate}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="checkout-progress-number">
                {isComplete ? <Check size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span>{step.label}</span>
            </button>
            {index < steps.length - 1 && <span className={`checkout-progress-line${index < activeStep ? ' is-complete' : ''}`} aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
