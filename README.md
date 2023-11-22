
# Cliente Web de Articoding

 Este proyecto ofrece una interfaz web para la gestión de una comunidad de Articoding.
 
 Se trata de un cliente web basado en Angular que permite consumir los recursos de un servidor [Articoding](https://github.com/henarmd/articodingserver) por lo que para su utilización es necesario un despliegue previo de esta herramienta.


## Despliegue

El proyecto esta sobre Angular CLI, para su despliegue:

1. Instalar NodeJs [NodeJs Official Page](https://nodejs.org/en).

2. Instalar [Angular CLI](https://github.com/angular/angular-cli)

3. Abrir terminal y acceder a la raiz del proyecto

5. Modificar el campo host del fichero environments.ts (ubicado en la carpeta .\src\environments\ ) para configurar la url del ArticodingServer:
     <p align="center">
    <img src="https://github.com/CesarCRP97/articodingclient/blob/master/imagesReadme/ImagenCliente1.png">
    </p>

6. Instalar dependencias ("npm install")

7. Introducir ```npm start```

8. Acceder al puerto definido desde el navegador.
    <p align="center">
    <img src="https://github.com/CesarCRP97/articodingclient/blob/master/imagesReadme/ImagenCliente2.png">
    </p>

    <p align="center">
    <img src="https://github.com/CesarCRP97/articodingclient/blob/master/imagesReadme/ImagenCliente3.png">
    </p>

NOTA: por defecto username: "root" y password "root01"


## Resources

- ArticodingServer: <https://github.com/henarmd/articodingserver>