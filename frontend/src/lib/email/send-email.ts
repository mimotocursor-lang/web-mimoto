/**
 * Función compartida para enviar emails usando Resend o SendGrid
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  fromEmail?: string;
  fromName?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean;
  error?: string;
  resendId?: string;
}> {
  try {
    const emailService = import.meta.env.EMAIL_SERVICE || 'resend';
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const sendgridApiKey = import.meta.env.SENDGRID_API_KEY;
    const fromEmail = options.fromEmail || import.meta.env.FROM_EMAIL || 'noreply@mimoto.cl';
    const fromName = options.fromName || import.meta.env.FROM_NAME || 'MIMOTO';

    console.log('📧 Enviando email:', {
      to: options.to,
      subject: options.subject,
      service: emailService,
      hasResendKey: !!resendApiKey,
      hasSendgridKey: !!sendgridApiKey,
      from: `${fromName} <${fromEmail}>`
    });

    // Intentar enviar con Resend
    if (emailService === 'resend' && resendApiKey) {
      const resendUrl = 'https://api.resend.com/emails';
      const emailPayload = {
        from: `${fromName} <${fromEmail}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      };

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
          console.log('✅ Email enviado exitosamente con Resend:', {
            id: result.id,
            from: result.from,
            to: result.to
          });
          return {
            success: true,
            resendId: result.id
          };
        } catch (e) {
          console.log('✅ Email enviado exitosamente con Resend (respuesta no JSON)');
          return { success: true };
        }
      } else {
        try {
          const error = JSON.parse(responseText);
          console.error('❌ Error enviando email con Resend:', {
            status: response.status,
            error: error,
            message: error.message
          });
          return {
            success: false,
            error: `Resend error (${response.status}): ${error.message || JSON.stringify(error)}`
          };
        } catch (e) {
          console.error('❌ Error enviando email con Resend (respuesta no JSON):', responseText);
          return {
            success: false,
            error: `Resend error (${response.status}): ${responseText}`
          };
        }
      }
    }
    // Intentar enviar con SendGrid
    else if (emailService === 'sendgrid' && sendgridApiKey) {
      const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
      const response = await fetch(sendgridUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: options.to }],
          }],
          from: { email: fromEmail, name: fromName },
          subject: options.subject,
          content: [{
            type: 'text/html',
            value: options.html,
          }],
        }),
      });

      if (response.ok) {
        console.log('✅ Email enviado exitosamente con SendGrid');
        return { success: true };
      } else {
        const error = await response.text();
        console.error('❌ Error enviando email con SendGrid:', error);
        return {
          success: false,
          error: `SendGrid error: ${error}`
        };
      }
    }
    // Si no hay servicio configurado
    else {
      console.log('⚠️ Servicio de email no configurado');
      return {
        success: false,
        error: 'Servicio de email no configurado'
      };
    }
  } catch (error: any) {
    console.error('❌ Error enviando email:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido'
    };
  }
}

/**
 * Genera el HTML del email con el logo y diseño de MIMOTO
 */
export function generateEmailHTML(options: {
  title: string;
  message: string;
  orderId?: number;
  amount?: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
  logoUrl?: string;
  footerMessage?: string;
}): string {
  const logoUrl = options.logoUrl || 'https://mimoto.cl/logo.jpg';
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://mimoto.cl';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
        }
        .header { 
          background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .logo {
          max-width: 150px;
          height: auto;
          margin-bottom: 15px;
        }
        .content { 
          padding: 30px 20px; 
          background: #ffffff;
        }
        .order-info {
          background: #f9f9f9;
          border-left: 4px solid #ff6600;
          padding: 15px;
          margin: 20px 0;
        }
        .order-info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .order-info-item:last-child {
          border-bottom: none;
        }
        .order-info-label {
          font-weight: bold;
          color: #666;
        }
        .order-info-value {
          color: #333;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          background: #ff6600;
          color: white;
          padding: 12px;
          text-align: left;
        }
        .items-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e0e0e0;
        }
        .items-table tr:last-child td {
          border-bottom: none;
        }
        .total-row {
          background: #f9f9f9;
          font-weight: bold;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          color: #666; 
          font-size: 12px;
          background: #f9f9f9;
          border-top: 1px solid #e0e0e0;
        }
        .button { 
          display: inline-block; 
          background: #ff6600; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px; 
          margin-top: 20px;
          font-weight: bold;
        }
        .button:hover {
          background: #ff8533;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="${logoUrl}" alt="MIMOTO" class="logo" />
          <h1 style="margin: 0; font-size: 24px;">${options.title}</h1>
        </div>
        <div class="content">
          <p>${options.message}</p>
          
          ${options.orderId ? `
          <div class="order-info">
            <div class="order-info-item">
              <span class="order-info-label">Número de pedido:</span>
              <span class="order-info-value">#${options.orderId}</span>
            </div>
            ${options.amount ? `
            <div class="order-info-item">
              <span class="order-info-label">Monto total:</span>
              <span class="order-info-value">$${Number(options.amount).toLocaleString('es-CL')}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}
          
          ${options.items && options.items.length > 0 ? `
          <h3 style="color: #333; margin-top: 30px;">Productos del pedido:</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${options.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${Number(item.price).toLocaleString('es-CL')}</td>
                  <td>$${Number(item.price * item.quantity).toLocaleString('es-CL')}</td>
                </tr>
              `).join('')}
              ${options.amount ? `
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Total:</td>
                  <td>$${Number(options.amount).toLocaleString('es-CL')}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
          ` : ''}
          
          <p style="margin-top: 30px;">Gracias por tu compra.</p>
          <p>Saludos,<br><strong>El equipo de MIMOTO</strong></p>
          
          <a href="${siteUrl}" class="button">Visitar nuestra tienda</a>
        </div>
        <div class="footer">
          <p>Este es un email automático, por favor no responder.</p>
          <p>MIMOTO - Tu tienda de confianza para motos y accesorios</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

