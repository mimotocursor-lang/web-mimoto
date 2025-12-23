import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const webpayEnvironment = import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT;
    const commerceCode = import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE;
    const apiKey = import.meta.env.PUBLIC_WEBPAY_API_KEY;
    const siteUrl = import.meta.env.PUBLIC_SITE_URL;

    // Determinar el ambiente
    const isProduction = webpayEnvironment === 'production';
    const resolvedEnvironment = isProduction ? 'Production' : 'Integration';
    const webpayHost = isProduction 
      ? 'https://webpay3g.transbank.cl' 
      : 'https://webpay3gint.transbank.cl';

    return new Response(
      JSON.stringify({
        success: true,
        environment: {
          PUBLIC_WEBPAY_ENVIRONMENT: webpayEnvironment || 'NO CONFIGURADO (usando integración)',
          resolvedEnvironment,
          isProduction,
          webpayHost,
          PUBLIC_WEBPAY_COMMERCE_CODE: commerceCode ? `${commerceCode.substring(0, 6)}...` : 'NO CONFIGURADO',
          PUBLIC_WEBPAY_API_KEY: apiKey ? `${apiKey.substring(0, 10)}...` : 'NO CONFIGURADO',
          PUBLIC_SITE_URL: siteUrl || 'NO CONFIGURADO',
        },
        diagnostic: {
          willUseProduction: isProduction,
          willRedirectTo: webpayHost,
          recommendation: isProduction 
            ? '✅ Configuración correcta para producción'
            : '⚠️ Configuración usando integración. Para producción, configura PUBLIC_WEBPAY_ENVIRONMENT=production en Vercel'
        }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error al obtener configuración' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

