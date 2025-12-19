import type { APIRoute } from 'astro';
import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;

/**
 * Endpoint de prueba para verificar si las credenciales de Webpay Plus funcionan
 * Accede a: /api/webpay/test?commerceCode=TU_CODIGO&apiKey=TU_API_KEY
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    // Usar valores por defecto de integración si no están configurados
    const defaultCommerceCode = '597055555532';
    const defaultApiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    
    const commerceCode = url.searchParams.get('commerceCode') 
      || import.meta.env.PUBLIC_WEBPAY_COMMERCE_CODE 
      || defaultCommerceCode;
    const apiKey = url.searchParams.get('apiKey') 
      || import.meta.env.PUBLIC_WEBPAY_API_KEY 
      || defaultApiKey;
    const environment = url.searchParams.get('environment') 
      || import.meta.env.PUBLIC_WEBPAY_ENVIRONMENT 
      || 'integration';

    if (!commerceCode || !apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan credenciales',
          message: 'Proporciona commerceCode y apiKey como parámetros de URL o variables de entorno',
          ejemplo: '/api/webpay/test?commerceCode=TU_CODIGO&apiKey=TU_API_KEY&environment=integration',
          valores_por_defecto: {
            commerceCode: defaultCommerceCode,
            apiKey: defaultApiKey.substring(0, 20) + '...',
            environment: 'integration'
          }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configurar Webpay Plus
    const env = environment === 'production' ? Environment.Production : Environment.Integration;
    const options = new Options(commerceCode, apiKey, env);
    const webpayPlus = new WebpayPlus.Transaction(options);

    // Intentar crear una transacción de prueba
    const buyOrder = `TEST-${Date.now()}`;
    const sessionId = `SESSION-${Date.now()}`;
    const amount = 1000; // $10.00 CLP en centavos
    const returnUrl = `${url.origin}/pago/confirmar?orderId=test`;

    try {
      const createResponse = await webpayPlus.create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
      );

      if (createResponse && createResponse.token && createResponse.url) {
        return new Response(
          JSON.stringify({
            success: true,
            message: '✅ ¡Webpay Plus está activo y funcionando!',
            detalles: {
              commerceCode,
              environment: env === Environment.Production ? 'production' : 'integration',
              token: createResponse.token,
              url: createResponse.url,
              buyOrder,
              amount: `$${(amount / 100).toLocaleString('es-CL')}`
            },
            instrucciones: {
              paso1: 'Las credenciales son válidas y Webpay Plus está activo',
              paso2: 'Puedes usar estas credenciales en tu integración',
              paso3: environment === 'integration' 
                ? 'Estás usando el ambiente de integración (pruebas)'
                : 'Estás usando el ambiente de producción'
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Respuesta inesperada de Webpay',
            message: 'Webpay respondió pero sin token o URL',
            respuesta: createResponse
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (webpayError: any) {
      // Analizar el error para dar información útil
      const errorMessage = webpayError.message || 'Error desconocido';
      const errorCode = webpayError.code || 'N/A';

      let diagnostico = '';
      let solucion = '';

      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('autenticación')) {
        diagnostico = 'Las credenciales (Commerce Code o API Key) son incorrectas';
        solucion = 'Verifica que el Commerce Code y API Key sean correctos en el Portal de Clientes de Transbank';
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        diagnostico = 'No tienes permisos para usar Webpay Plus con estas credenciales';
        solucion = 'Verifica que Webpay Plus esté contratado y activo en tu cuenta de Transbank';
      } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        diagnostico = 'El Commerce Code no existe o no está asociado a Webpay Plus';
        solucion = 'Verifica que el Commerce Code sea correcto y que Webpay Plus esté contratado';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        diagnostico = 'Error de conexión con los servidores de Transbank';
        solucion = 'Verifica tu conexión a internet e intenta nuevamente';
      } else {
        diagnostico = 'Error al comunicarse con Webpay Plus';
        solucion = 'Revisa los logs para más detalles';
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Error al probar Webpay Plus',
          mensaje: errorMessage,
          codigo: errorCode,
          diagnostico,
          solucion,
          credenciales_usadas: {
            commerceCode,
            environment: env === Environment.Production ? 'production' : 'integration',
            apiKeyLength: apiKey.length
          },
          instrucciones: {
            paso1: 'Verifica que Webpay Plus esté contratado en el Portal de Clientes de Transbank',
            paso2: 'Confirma que el Commerce Code y API Key sean correctos',
            paso3: 'Si estás en producción, asegúrate de haber completado el proceso de certificación',
            paso4: 'Si es la primera vez, usa el ambiente "integration" para pruebas'
          }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error inesperado',
        message: error.message || 'Error desconocido',
        stack: import.meta.env.DEV ? error.stack : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

