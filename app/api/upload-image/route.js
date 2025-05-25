import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Configurar o ImageKit com as credenciais
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL
});

export async function POST(request) {
  try {
    // Obter o FormData da requisição
    const formData = await request.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName') || `pessoa_amada_${Date.now()}`;
    const folder = formData.get('folder') || 'pessoas-amadas';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Converter o arquivo para um buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Fazer upload para o ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
    });

    // Retornar a URL da imagem
    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}
