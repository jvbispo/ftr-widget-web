function getFileNameFromUrl(url: string): string {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const segments = pathname.split('/');
  return segments.pop() || '';
}

export const downloadUrl = async ( imageUrl: string ) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Criar um elemento <a> temporário
      const a = document.createElement("a");
      a.href = url;
      a.download = getFileNameFromUrl( imageUrl );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Liberar o objeto URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar a imagem:", error);
    }
  };