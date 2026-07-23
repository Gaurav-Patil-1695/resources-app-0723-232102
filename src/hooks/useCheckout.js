import { useState, useCallback } from 'react';

const STEPS = ['address', 'payment', 'review'];
const INITIAL_FORM_STATE = {
  address: {},
  payment: {},
  review: {},
};

export function useCheckout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const currentStepName = STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  const updateStepData = useCallback((step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
      },
    }));
  }, []);

  const setStepErrors = useCallback((step, stepErrors) => {
    setErrors((prev) => ({
      ...prev,
      [step]: stepErrors,
    }));
  }, []);

  const clearStepErrors = useCallback((step) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[step];
      return next;
    });
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setCurrentStep(stepIndex);
    }
  }, []);

  const resetCheckout = useCallback(() => {
    setCurrentStep(0);
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSubmitting(false);
    setOrderResult(null);
  }, []);

  return {
    steps: STEPS,
    currentStep,
    currentStepName,
    isFirstStep,
    isLastStep,
    formData,
    errors,
    submitting,
    setSubmitting,
    orderResult,
    setOrderResult,
    updateStepData,
    setStepErrors,
    clearStepErrors,
    goToNextStep,
    goToPrevStep,
    goToStep,
    resetCheckout,
  };
}
