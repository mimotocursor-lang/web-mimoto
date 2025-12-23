import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const testEmail = url.searchParams.get('email') || 'mimotocursor@gmail.com';
  
  try {
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const fromEmail = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
    const fromName = import.meta.env.FROM_NAME || 'MIMOTO';

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'RESEND_API_KEY no está configurada',
          hasKey: false
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6600; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email de Prueba</h1>
          </div>
          <div class="content">
            <p>Este es un email de prueba desde MIMOTO.</p>
            <p>Si recibes este email, significa que la configuración de Resend está funcionando correctamente.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resendUrl = 'https://api.resend.com/emails';
    const emailPayload = {
      from: `${fromName} <${fromEmail}>`,
      to: [testEmail],
      subject: 'Email de Prueba - MIMOTO',
      html: emailHtml,
    };

    console.log('📤 Enviando email de prueba:', {
      to: testEmail,
      from: emailPayload.from,
      hasApiKey: !!resendApiKey,
      apiKeyPrefix: resendApiKey.substring(0, 10) + '...'
    });

    const response = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await response.text();
    
    console.log('📥 Respuesta de Resend:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      body: responseText
    });

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Email enviado exitosamente',
            resendId: result.id,
            from: result.from,
            to: result.to,
            created_at: result.created_at,
            fullResponse: result
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Email enviado (respuesta no JSON)',
            response: responseText
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      try {
        const error = JSON.parse(responseText);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Error enviando email',
            status: response.status,
            resendError: error,
            message: error.message,
            details: error.details
          }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Error enviando email',
            status: response.status,
            response: responseText
          }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error: any) {
    console.error('❌ Error en test-email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido',
        stack: error.stack
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

