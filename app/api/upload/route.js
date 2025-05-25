import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Inicializar o ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Converter o arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Gerar um nome de arquivo único
    const fileName = `mothers_day_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Fazer o upload para o ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: '/mothers-day-experiences'
    });
    
    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId
    });
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}
