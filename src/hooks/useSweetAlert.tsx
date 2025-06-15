
import Swal from 'sweetalert2';

export function useSweetAlert() {
  const showSuccess = (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#3b82f6',
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showError = (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#ef4444',
    });
  };

  const showWarning = (title: string, text?: string) => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#f59e0b',
    });
  };

  const showConfirm = (title: string, text?: string) => {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });
  };

  const showLoading = (title: string = 'Loading...') => {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const closeLoading = () => {
    Swal.close();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    showLoading,
    closeLoading,
  };
}
