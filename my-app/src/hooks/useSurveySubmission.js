// hooks/useSurveySubmission.ts
import { useState } from 'react';

export const useSurveySubmission = () => {
  const [loading, setLoading] = useState(false);

  const submitData = async (payload) => {
    setLoading(true);
    try {
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Submission failed');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { submitData, loading };
};