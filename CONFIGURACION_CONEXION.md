# 🔧 Configuración de Conexión - App EPS

## 📱 Configuración de URL según el entorno

### Para Emulador Android (Recomendado para desarrollo)
```javascript
// En AppEps/src/config/apiConfig.js
BASE_URL: 'http://10.0.2.2:8000/api'
```

### Para Dispositivo Físico Android/iOS
```javascript
// En AppEps/src/config/apiConfig.js
BASE_URL: 'http://TU_IP_LOCAL:8000/api'
// Ejemplo: 'http://192.168.1.100:8000/api'
```

### Para Web (Expo Web)
```javascript
// En AppEps/src/config/apiConfig.js
BASE_URL: 'http://localhost:8000/api'
```

## 🚀 Pasos para configurar correctamente:

### 1. Obtener tu IP local
**En Windows:**
```cmd
ipconfig
```
Busca "Dirección IPv4" en tu adaptador de red activo.

**En Mac/Linux:**
```bash
ifconfig | grep "inet "
```

### 2. Configurar el backend Laravel
Asegúrate de que tu servidor Laravel esté ejecutándose en el puerto 8000:
```bash
cd eps-citas-api
php artisan serve --host=0.0.0.0 --port=8000
```

### 3. Verificar la conexión
- El backend debe estar accesible desde la URL configurada
- No debe haber firewall bloqueando el puerto 8000
- La IP debe ser correcta para tu red local

## 🔍 Solución de problemas comunes:

### Error: "Network Error"
- ✅ Verifica que el backend esté ejecutándose
- ✅ Confirma que la IP sea correcta
- ✅ Asegúrate de que no haya firewall bloqueando

### Error: "ECONNREFUSED"
- ✅ El servidor no está ejecutándose
- ✅ La URL es incorrecta
- ✅ El puerto está bloqueado

### Error: "Timeout"
- ✅ El servidor está muy lento
- ✅ Problemas de red
- ✅ Aumenta el timeout en la configuración

## 📝 Notas importantes:

1. **Para desarrollo local**: Usa `10.0.2.2:8000` en emulador Android
2. **Para dispositivos físicos**: Usa tu IP local real
3. **Para producción**: Usa HTTPS con un dominio real
4. **Siempre verifica**: Que el backend responda en `http://TU_IP:8000/api/test`

## 🎯 Configuración recomendada para desarrollo:

```javascript
// AppEps/src/config/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:8000/api', // Para emulador Android
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
```
