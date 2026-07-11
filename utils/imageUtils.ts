const MAX_IMAGE_SIZE = 1200;
const IMAGE_QUALITY = 0.72;

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Le fichier sélectionné n'est pas une image."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Impossible de lire l'image."));
    };

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => {
        reject(new Error("Impossible de charger l'image."));
      };

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > height && width > MAX_IMAGE_SIZE) {
          height = Math.round(
            height * (MAX_IMAGE_SIZE / width)
          );
          width = MAX_IMAGE_SIZE;
        } else if (
          height >= width &&
          height > MAX_IMAGE_SIZE
        ) {
          width = Math.round(
            width * (MAX_IMAGE_SIZE / height)
          );
          height = MAX_IMAGE_SIZE;
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(
            new Error("Impossible de préparer l'image.")
          );
          return;
        }

        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        resolve(
          canvas.toDataURL("image/jpeg", IMAGE_QUALITY)
        );
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}