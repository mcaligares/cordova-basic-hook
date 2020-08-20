# Cordova Basic Hook

Hook básico para aplicaciones cordova.

Agrega configuración automática del plugin [cordova-plugin-whitelist](https://github.com/apache/cordova-plugin-whitelist) para agregar acceso o permitir abrir dominios.

## Instalación

Instalación del paquete:

```bash
npm install cordova-basic-hook
```

Implementación del hook:

```xml
<widget ...>
  <hook type="before_build" src="../node_modules/cordova-basic-hook/index.js" />
  <hook type="after_build" src="../node_modules/cordova-basic-hook/index.js" />
</widget>
```

## Configuración

Para agregar un dominio debemos agregar una entrada en el archivo `package.json` del proyecto. En el hook se leerá la entrada y se la agregará en el archivo `config.xml`.

Los dominios que la aplicación consumirá deben estar en la propiedad `allowedDomain`. Estas entradas se agregarán en el elemento [access](https://cordova.apache.org/docs/en/9.x/config_ref/index.html#access) del archivo `config.xml`.

Los dominios que la aplicación abrirá de forma externa deben estar en la propiedad `allowedSites`. Estas entradas se agregarán en el elemento [allow-intent](https://cordova.apache.org/docs/en/9.x/config_ref/index.html#allow-intent) del archivo `config.xml`.

_package.json_

```js
{
  "cordova": {
    "config": {
      "allowedDomains": [
        "https://api.example.com"
      ],
      "allowedSites": [
        "https://site.example.com"
      ]
    }
  }
}
```

Tambien soporta los valores tomados de variables de entorno. Los nombres de variables deberán anteponer el prefijo `$` para tomar su verdadero valor desde las variables de entorno.

_.env.development_
```
API_DOMAIN=https://api.example.com
SITE_DOMAIN=https://site.example.com
```

_package.json_
```js
{
  "cordova": {
    "config": {
      "allowedDomains": [
        "$API_DOMAIN"
      ],
      "allowedSites": [
        "$SITE_DOMAIN"
      ]
    }
  }
}
```

Resultado:
_config.xml_

```xml

<widget ...>
  <access origin="https://api.example.com"/>
  <allow-intent href="https://site.example.com" />
</widget>
```
