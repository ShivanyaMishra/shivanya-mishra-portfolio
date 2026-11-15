/**
 * Helper to download the official resume PDF safely without navigating the window
 */
export const downloadResume = async () => {
  try {
    const res = await fetch('/Shivanya_Mishra_Resume.pdf');
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = 'Shivanya_Mishra_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1500);
  } catch {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = '/Shivanya_Mishra_Resume.pdf';
    link.download = 'Shivanya_Mishra_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
