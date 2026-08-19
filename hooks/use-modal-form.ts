import { useState } from 'react';

export function useModalForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const openModal = (data?: any) => {
    setFormData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData(null);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Aquí puedes procesar los datos del formulario
      const data = Object.fromEntries(formData.entries());
      console.log('Form data:', data);
      
      // Aquí puedes hacer la llamada a la API
      // await createItem(data);
      
      closeModal();
      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  return {
    isOpen,
    formData,
    openModal,
    closeModal,
    handleSubmit
  };
} 