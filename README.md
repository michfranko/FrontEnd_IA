# Sistema Inteligente de Control de Tráfico

Este proyecto implementa un sistema inteligente para el control de semáforos basado en la detección de vehículos en tiempo real. Utiliza un modelo de aprendizaje profundo para analizar imágenes de las intersecciones y optimizar el flujo del tráfico.

## Características Principales

- **Detección de Vehículos en Tiempo Real**: Utiliza el modelo YOLO para identificar y contar vehículos en las imágenes capturadas de las cámaras de tráfico.
- **Control Dinámico de Semáforos**: Ajusta los tiempos de los semáforos en función de la densidad de vehículos detectada en cada carril.
- **Frontend Interactivo**: Una interfaz de usuario desarrollada en Angular que permite visualizar el estado de los semáforos, las imágenes de las cámaras y el recuento de vehículos.
- **Backend Robusto**: Un servidor Flask que procesa las imágenes, ejecuta el modelo de detección y gestiona la lógica de control de los semáforos.
- **Historial de Análisis**: Almacena un registro de todos los análisis realizados en una base de datos PostgreSQL, permitiendo consultas y auditorías posteriores.

## Tecnologías Utilizadas

### Frontend
- **Angular**: Framework para construir la interfaz de usuario.
- **TypeScript**: Lenguaje principal para el desarrollo en Angular.
- **HTML5 y CSS3**: Para la estructura y el estilo de la aplicación web.

### Backend
- **Flask**: Microframework de Python para construir el servidor API REST.
- **YOLO (You Only Look Once)**: Modelo de detección de objetos para el análisis de imágenes.
- **OpenCV**: Biblioteca para el procesamiento de imágenes.
- **PostgreSQL**: Sistema de gestión de bases de datos para almacenar el historial de análisis.

## Arquitectura del Sistema

El sistema se compone de tres partes principales:

1.  **Frontend (Angular)**: Es la capa de presentación con la que interactúa el usuario. Se comunica con el backend a través de llamadas a la API REST para enviar imágenes y recibir los resultados del análisis.
2.  **Backend (Flask)**: Es el cerebro del sistema. Recibe las imágenes del frontend, las procesa utilizando el modelo YOLO, determina la acción a tomar sobre los semáforos y guarda los resultados en la base de datos.
3.  **Base de Datos (PostgreSQL)**: Almacena de forma persistente la información de cada análisis, incluyendo las imágenes, el recuento de vehículos y el estado de los semáforos.

## Instalación y Puesta en Marcha

### Prerrequisitos

- Node.js y npm
- Python 3.x y pip
- PostgreSQL

### Configuración del Frontend

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/michfranko/FrontEnd_IA.git
    ```
2.  Navega al directorio del proyecto:
    ```bash
    cd FrontEnd_IA
    ```
3.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo de Angular:
    ```bash
    ng serve
    ```
    La aplicación estará disponible en `http://localhost:4200/`.

### Configuración del Backend

1.  Instala las dependencias de Python:
    ```bash
    pip install -r requirements.txt
    ```
    *(Nota: Asegúrate de tener un archivo `requirements.txt` con todas las librerías necesarias como Flask, OpenCV, psycopg2-binary, etc.)*

2.  Configura la conexión a la base de datos en `back.py` con tus credenciales de PostgreSQL.

3.  Ejecuta el servidor Flask:
    ```bash
    python back.py
    ```
    El servidor se iniciará en `http://localhost:5000/`.

## Uso

1.  Abre tanto la aplicación en tu navegador como el simulador en Unity.
2.  La aplicacion realizara la conexion con el simulador y empezara a enviar imagenes a la apliacion.
3.  El sistema procesará las imágenes, mostrará el recuento de vehículos y ajustará los semáforos en consecuencia.
4.  Puedes consultar el historial de análisis en la sección correspondiente.

