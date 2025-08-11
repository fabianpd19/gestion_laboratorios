import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, isOAuthUser } = await request.json();
    
    // Validaciones básicas
    if (!newPassword) {
      return NextResponse.json(
        { success: false, message: 'La nueva contraseña es requerida' },
        { status: 400 }
      );
    }
    
    if (!isOAuthUser && !currentPassword) {
      return NextResponse.json(
        { success: false, message: 'La contraseña actual es requerida' },
        { status: 400 }
      );
    }
    
    // Obtener el token de la cookie o del header de autorización
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Llamar al backend para cambiar la contraseña
    const response = await fetch('http://localhost:3001/api/usuarios/cambiar-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        isOAuthUser
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Error al cambiar la contraseña' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Error en cambio de contraseña:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}